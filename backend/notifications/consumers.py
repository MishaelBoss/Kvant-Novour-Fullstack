import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels.exceptions import ChannelFull
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import get_user_model
from django.apps import apps

logger = logging.getLogger(__name__)
User = get_user_model()


@database_sync_to_async
def get_user_from_jwt(raw_token):
    try:
        validated_token = AccessToken(raw_token)
        user = User.objects.get(id=validated_token['user_id'])
        token_jti = validated_token.get('jti')

        if token_jti:
            UserSession = apps.get_model('users', 'UserSession')
            if not UserSession.objects.filter(user=user, jti=token_jti).exists():
                return None

        return user if user.is_active else None
    except (TokenError, User.DoesNotExist):
        return None


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        raw_token = self.get_token_from_cookies()
        if not raw_token:
            logger.warning('WS connect rejected: no token cookie')
            await self.close(code=4001)
            return

        self.user = await get_user_from_jwt(raw_token)
        if self.user is None:
            logger.warning('WS connect rejected: invalid token')
            await self.close(code=4001)
            return

        self.group_name = f'notifications_{self.user.id}'

        try:
            await self.channel_layer.group_add(self.group_name, self.channel_name)
        except Exception as ex:
            logger.error(f'Redis error on group_add for user {self.user.id}: {ex}')

        await self.accept()
        logger.info(f'WS connected: user {self.user.id} ({self.user.username})')

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            try:
                await self.channel_layer.group_discard(self.group_name, self.channel_name)
            except Exception:
                pass
            if hasattr(self, 'user'):
                logger.info(f'WS disconnected: user {self.user.id}')

    async def receive(self, text_data):
        pass

    async def send_notification(self, event):
        try:
            await self.send(text_data=json.dumps(event['data']))
        except Exception as ex:
            logger.error(f'WS send error for user {getattr(self, "user", None)}: {ex}')

    def get_token_from_cookies(self):
        headers = dict(self.scope.get('headers', []))
        cookie_header = headers.get(b'cookie', b'').decode()
        for part in cookie_header.split(';'):
            part = part.strip()
            if part.startswith('access_token='):
                return part[len('access_token='):]
        return None

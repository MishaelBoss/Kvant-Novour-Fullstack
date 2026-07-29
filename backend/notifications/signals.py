import logging
from django.db.models.signals import post_save
from django.db import connection
from django.dispatch import receiver
from asgiref.sync import async_to_sync 
from channels.layers import get_channel_layer
from .models import Notification


logger = logging.getLogger(__name__)

@receiver(post_save, sender=Notification)
def send_notification_to_websocket(sender, instance, created, **kwargs):
    if not created:
        return

    print("! Test signals", instance.title)

    def send_ws():
        try:
            channel_layer = get_channel_layer()
            group_name = f"user_{instance.user_id}_notification"
            
            notification_data = {
                "id": instance.id,
                "type": instance.type,
                "title": instance.title,
                "description": instance.description,
                "is_read": instance.is_read,
                "created_at": instance.created_at.isoformat() if instance.created_at else None
            }

            async_to_sync(channel_layer.group_send)(
                group_name, {
                    "type": "send_notification",
                    "data": notification_data
                }
            )
        except Exception as ex:
            logger.error(
                f"WS error: не удалось отправить уведомление user {instance.user_id}: {ex}", 
                exc_info=True
            )

    try:
        connection.on_commit(send_ws)
    except Exception as ex:
        logger.error(f"Ошибка регистрации on_commit для user {instance.user_id}: {ex}", exc_info=True)
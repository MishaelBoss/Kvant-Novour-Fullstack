from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.apps import apps

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token = request._request.COOKIES.get('access_token') or getattr(request, '_request', {}).COOKIES.get('access_token')
        
        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
        except Exception:
            return None

        try:
            token_jti = validated_token.get('jti')
            UserSession = apps.get_model('users', 'UserSession')

            session_exists = UserSession.objects.filter(user=user, jti=token_jti).exists()

            if not session_exists:
                return None
                
        except Exception:
            pass

        return user, validated_token
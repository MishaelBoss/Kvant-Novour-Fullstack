from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from django.conf import settings
from .authentication import *
from .models import *
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import *
from notifications.models import *
import requests
from django_user_agents.utils import get_user_agent
from django.utils import timezone


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            refresh = MyTokenObtainPairSerializer.get_token(user)

            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            token_obj = AccessToken(access_token)
            access_jti = token_obj['jti']

            user_agent = get_user_agent(request)
            browser = f"{user_agent.browser.family} (версия {user_agent.browser.version_string})"
            os_platform = user_agent.os.family
            user_agent_string = str(user_agent)

            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            ip = x_forwarded_for.split(',')[0].strip() if x_forwarded_for else request.META.get('REMOTE_ADDR', '127.0.0.1')

            existing_session = UserSession.objects.filter(
                user=user,
                user_agent_string=user_agent_string
            ).first()

            if existing_session:
                existing_session.jti = access_jti
                existing_session.ip_address = ip
                existing_session.save()
            else:
                UserSession.objects.create(
                    user=user,
                    jti=access_jti,
                    ip_address=ip,
                    location="Локальная сеть" if ip in ('127.0.0.1', '::1') else "Определяется...",
                    browser=browser,
                    os=os_platform,
                    user_agent_string=user_agent_string
                )

            response = Response({"message": "Успех"}, status=status.HTTP_201_CREATED)

            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                max_age=3600
            )

            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                max_age=3600 * 24 * 7
            )
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        refresh = MyTokenObtainPairSerializer.get_token(user)

        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        token_obj = AccessToken(access_token)
        access_jti = token_obj['jti']

        response = Response({
            "message": "Вход выполнен успешно",
            "username": user.username
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax',
            max_age=3600
        )

        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax',
            max_age=3600 * 24 * 7
        )

        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '127.0.0.1')

        if ip in ('127.0.0.1', '::1'):
            location = "Локальная сеть"
        else:
            try:
                geo_res = requests.get(f"http://ip-api.com{ip}?lang=ru", timeout=2).json()
                if geo_res.get('status') == 'success':
                    location = f"{geo_res.get('city', 'Неизвестный город')}, {geo_res.get('country', 'Россия')}"
                else:
                    location = "Не удалось определить город"
            except Exception:
                location = "Не удалось определить город (ошибка сети)"

        user_agent = get_user_agent(request)
        browser = f"{user_agent.browser.family} (версия {user_agent.browser.version_string})"
        os_platform = user_agent.os.family
        user_agent_string = str(user_agent)

        existing_session = UserSession.objects.filter(
            user=user,
            user_agent_string=user_agent_string
        ).first()

        if existing_session:
            existing_session.jti = access_jti
            existing_session.ip_address = ip
            existing_session.location = location
            existing_session.save()
        else:
            UserSession.objects.create(
                user=user,
                jti=access_jti,
                ip_address=ip,
                location=location,
                browser=browser,
                os=os_platform,
                user_agent_string=user_agent_string
            )

        current_time = timezone.localtime(timezone.now()).strftime('%d.%m.%Y %H:%M MSK')

        description_text = (
            f"Вход в аккаунт. Браузер {browser} на {os_platform}.\n"
            f"Город: {location}, IP {ip}.\n"
            f"Дата и время входа: {current_time}.\n"
            f"Если это были не вы — напишите в поддержку и в настройках аккаунта завершите сеанс на подозрительном устройстве."
        )

        Notification.objects.create(
            user=user,
            type='system',
            title='Вход с нового устройства',
            description=description_text
        )

        return response
    

class UserStatusView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user

        if not user or not user.is_authenticated:
            return Response({"is_authenticated": False}, status=status.HTTP_200_OK)
        
        profile = get_object_or_404(UserProfile, user=user)

        avatar_url = request.build_absolute_uri(profile.avatar.url) if profile.avatar else None

        return Response({
                "is_authenticated": True,
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": profile.role,
                "is_admin": profile.is_admin,
                "is_teacher": profile.is_teacher,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "middle_name": profile.middle_name,
                "phone": profile.phone,
                "avatar": avatar_url,
                "date_joined": user.date_joined,
            })
    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        raw_token = request.COOKIES.get('access_token')
        if raw_token:
            try:
                authenticator = JWTAuthentication()
                validated_token = authenticator.get_validated_token(raw_token)
                current_jti = validated_token.get('jti')
                
                UserSession.objects.filter(user=request.user, jti=current_jti).delete()
            except Exception:
                pass

        response = Response({"message": "Вы успешно вышли из системы"}, status=status.HTTP_200_OK)
        
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        
        return response
    

class EditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        serializer = UpdateProfile(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Профиль обновлен",
                "user": serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UploadAvatarView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        serializer = UpdateProfileAvatarSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Аватар успешно обновлен", "user": serializer.data},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class PublickProfileViewView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        profile = get_object_or_404(UserProfile, user=request.user)
        try:
            user = User.objects.get(username=username)

            avatar_url = request.build_absolute_uri(profile.avatar.url) if profile.avatar else None
            
            return Response({
                "username": user.username,
                "first_name": user.first_name,
                "date_joined": user.date_joined,
                "avatar": avatar_url
            })
        except User.DoesNotExist:
            return Response({"error": "Пользователь не найден"}, status=404)
        

class ListUsersView(APIView):
    permission_classes = [IsAdminRole]
    
    def get(self, request):
        users = User.objects.select_related('userprofile').all();

        data = []

        for u in users:
            p = u.userprofile
            
            avatar_url = request.build_absolute_uri(p.avatar.url) if p.avatar else ''

            data.append({
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'phone': p.phone,
                'first_name': u.first_name,
                'last_name': u.last_name,
                'middle_name': p.middle_name,
                'avatar': avatar_url,
                'date_joined': u.date_joined,
            })
        return Response({
            'count': users.count(),
            'results': data
        })
    

class UserDeleteView(APIView):
    permission_classes = [IsAdminRole]

    def delete(self, request, id):
        if request.user.id == int(id):
            return Response(
                {'error': 'Вы не можете удалить свою собственную учетную запись'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = get_object_or_404(User, id=id)
        user.delete()

        return Response(
            {'message': 'Пользователь успешно удален'}, 
            status=status.HTTP_200_OK
        )


class CreateUserView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Пользователь успешно создан"}, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UserSessionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = UserSession.objects.filter(user=request.user).order_by('-created_at')
        
        serializer = UserSessionSerializer(sessions, many=True, context={'request': request})
        
        return Response(serializer.data)
    

class SessionsDeleteView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        session = get_object_or_404(UserSession, id=pk, user=request.user)

        if session.jti:
            try:
                outstanding = OutstandingToken.objects.filter(jti=session.jti).first()
                if outstanding:
                    BlacklistedToken.objects.get_or_create(token=outstanding)
            except Exception:
                pass

        session.delete()
        return Response({"message": "Сессия завершена"}, status=status.HTTP_200_OK)
    

class SessionsDeleteAllView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        try:
            outstanding_tokens = OutstandingToken.objects.filter(user=request.user)

            blacklisted_objects = [
                BlacklistedToken(token=t)
                for t in outstanding_tokens
            ]
            BlacklistedToken.objects.bulk_create(blacklisted_objects, ignore_conflicts=True)
        except Exception as e:
            print(f"Ошибка блэклиста: {e}")

        UserSession.objects.filter(user=request.user).delete()

        response = Response({"message": "Все сеансы завершены"}, status=status.HTTP_200_OK)

        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response
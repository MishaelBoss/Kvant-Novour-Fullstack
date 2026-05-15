from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from .authentication import *
from .models import *
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import *


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            serializer = LoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)

            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

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

        return response
    

class UserStatusView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user

        if not user or not user.is_authenticated:
            return Response({"is_authenticated": False}, status=status.HTTP_200_OK)
        
        profile = get_object_or_404(UserProfile, user=user)

        return Response({
                "is_authenticated": True,
                "username": user.username,
                "email": user.email,
                "role": profile.role,
                "is_admin": profile.is_admin,
                "is_teacher": profile.is_teacher,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "middle_name": profile.middle_name,
                "phone": profile.phone,
                "id": user.id
            })
    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Успешный выход"}, status=status.HTTP_200_OK)

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
            })
        return Response(serializer.errors, status=400)
    

class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user 
        profile = user.userprofile
        try:
            return Response({
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "middle_name": profile.middle_name,
                "phone": profile.phone,
                "email": user.email,
                "date_joined": user.date_joined,
                "role": profile.role,
                "is_admin": profile.is_admin,
                "is_authenticated": True,
                "avatar": request.build_absolute_uri(profile.image.url) if profile.image else None
            })
        except User.DoesNotExist:
            return Response({"error": "Пользователь не найден"}, status=404)


class ProfileViewView(APIView):
    permission_classes = [IsAdminRole | IsTeacherRole]

    def get(self, request, pk):
        profile = get_object_or_404(UserProfile, user=request.user)
        try:
            user = User.objects.get(pk=pk)
            return Response({
                "username": user.username,
                "first_name": user.first_name,
                "date_joined": user.date_joined,
                "image": profile.image.url if profile.image else ""
            })
        except User.DoesNotExist:
            return Response({"error": "Пользователь не найден"}, status=404)
        

class ListUsersView(APIView):
    permission_classes = [IsAdminRole]
    
    def get(self, request):
        users = User.objects.all();

        data = []

        for u in users:
            p = UserProfile.objects.get(user=u)
            data.append({
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'phone': p.phone,
                'first_name': u.first_name,
                'last_name': u.last_name,
                'middle_name': p.middle_name,
                'avatar': p.image.path if p.image else '',
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
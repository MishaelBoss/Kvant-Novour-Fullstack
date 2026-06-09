from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import *
import os


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    middle_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name', 'middle_name']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует")
        return value

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Пользователь с таким именем уже существует")
        return value
    
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Пароль должен содержать минимум 8 символов")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')

        profile = {
            'middle_name': validated_data.get('middle_name', '')
        }

        user = User.objects.create_user(
            username=validated_data['username'],
            password=password,
            email=validated_data.get('email', ''),
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        UserProfile.objects.update_or_create(user=user, defaults=profile)

        return user
    

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data.get('username'),
            password=data.get('password')
        )

        if not user:
            raise serializers.ValidationError("Неверные учетные данные")
        
        if not user.is_active:
            raise serializers.ValidationError("Пользователь деактивирован")
        
        data['user'] = user
        return data
    

class UpdateProfile(serializers.ModelSerializer):
    middle_name = serializers.CharField(source='userprofile.middle_name', required=False, allow_blank=True)
    phone = serializers.CharField(source='userprofile.phone', required=False, allow_blank=True, allow_null=True)
    avatar = serializers.ImageField(source='userprofile.avatar', required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'middle_name', 'phone', 'email', 'avatar']

    def validate_username(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(username__iexact=value).exists():
            raise serializers.ValidationError("Пользователь с таким именем уже существует")
        return value

    def validate_email(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(email__iexact=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует")
        return value

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('userprofile', {})

        instance = super().update(instance, validated_data)

        if profile_data:
            profile = instance.userprofile
            if 'middle_name' in profile_data:
                profile.middle_name = profile_data['middle_name']
            if 'phone' in profile_data:
                profile.phone = profile_data['phone']
            if 'avatar' in profile_data:
                new_avatar = profile_data['avatar']
                
                if profile.avatar and os.path.isfile(profile.avatar.path):
                    try:
                        os.remove(profile.avatar.path)
                    except Exception as e:
                        print(f"Не удалось удалить старый файл: {e}")
                profile.avatar = new_avatar
            profile.save()

        return instance
    

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    middle_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email = serializers.CharField(write_only=True, required=False, allow_blank=True)
    role = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'middle_name', 'phone', 'email', 'role'] 

    def create(self, validated_data):
        password = validated_data.pop('password')

        profile = {
            'middle_name': validated_data.get('middle_name', ''),
            'phone': validated_data.get('phone', ''),
            'role': validated_data.get('role', '')
        }

        user = User.objects.create_user(
            username=validated_data['username'],
            password=password,
            email=validated_data.get('email', ''),
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        UserProfile.objects.update_or_create(user=user, defaults=profile)

        return user
    

class StudyGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyGroup
        fields = '__all__'


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        is_admin_user = bool(user.is_staff or user.is_superuser)

        profile = getattr(user, 'userprofile', None)
        if profile:
            is_admin_user = is_admin_user or profile.is_admin

        token['is_admin'] = profile.is_admin if profile else False
        token['username'] = user.username

        token.access_token['is_admin'] = token['is_admin']
        token.access_token['username'] = token['username']

        return token
    

class UserSessionSerializer(serializers.ModelSerializer):
    is_current = serializers.SerializerMethodField()

    class Meta:
        model = UserSession
        fields = ['id', 'ip_address', 'location', 'browser', 'os', 'created_at', 'is_current']

    def get_is_current(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False

        raw_token = request.COOKIES.get('access_token')
        if not raw_token:
            return False

        try:
            authenticator = JWTAuthentication()
            validated_token = authenticator.get_validated_token(raw_token)
            current_jti = validated_token.get('jti')
            
            return str(obj.jti) == str(current_jti)
        except Exception:
            return False
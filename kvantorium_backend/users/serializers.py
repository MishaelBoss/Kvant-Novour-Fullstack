from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *

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
    middle_name = serializers.CharField(source='userprofile.middle_name', required=False)
    phone = serializers.CharField(source='userprofile.phone', required=False)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'middle_name', 'phone', 'email']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('userprofile', {})
        middle_name = profile_data.get('middle_name')
        phone = profile_data.get('phone')

        instance = super().update(instance, validated_data)

        if middle_name is not None:
            profile = instance.userprofile
            profile.middle_name = middle_name
            profile.phone = phone
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

        profile = getattr(user, 'userprofile', None)
        is_profile_admin = profile.role == 'admin' if profile else False

        token['is_admin'] = user.is_staff or user.is_superuse or is_profile_admin
        token['username'] = user.username
        token['role'] = profile.role if profile else 'user'

        return token
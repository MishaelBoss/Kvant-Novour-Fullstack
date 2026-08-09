import os
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import *
from io import BytesIO
from PIL import Image, ImageOps
from django.core.files.base import ContentFile


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

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'middle_name', 'phone', 'email']

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
            profile.save()

        return instance
    

class UpdateProfileAvatarSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(source='userprofile.avatar', required=True, allow_null=True)

    class Meta:
        model = User
        fields = ['avatar']

    def validate_avatar(self, value):
        if value:
            max_size = 5 * 1024 * 1024 
            if value.size > max_size:
                raise serializers.ValidationError("Размер файла не должен превышать 5 МБ.")

            valid_mime_types = ['image/jpeg', 'image/png', 'image/webp']
            if value.content_type not in valid_mime_types:
                raise serializers.ValidationError("Файл не является валидным изображением.")

        return value

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('userprofile', {})

        if profile_data:
            profile = instance.userprofile
            if 'avatar' in profile_data:
                new_avatar = profile_data['avatar']
                
                if new_avatar:
                    img = Image.open(new_avatar)
                    
                    if img.mode in ('RGBA', 'LA'):
                        background = Image.new('RGB', img.size, (255, 255, 255))
                        background.paste(img, mask=img.split()[-1])
                        img = background
                    elif img.mode != 'RGB':
                        img = img.convert('RGB')

                    img = ImageOps.fit(img, (384, 384), Image.Resampling.LANCZOS)

                    output_buffer = BytesIO()
                    img.save(output_buffer, format='WEBP', quality=80)
                    output_buffer.seek(0)

                    new_avatar = ContentFile(output_buffer.read(), name="avatar.webp")

                if profile.avatar and os.path.isfile(profile.avatar.path):
                    try:
                        os.remove(profile.avatar.path)
                    except Exception as ex:
                        print(f"Не удалось удалить старый файл: {ex}")
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
    

class GroupMembershipSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source='group.name', read_only=True)
    course = serializers.CharField(source='group.course', read_only=True)
    module_type = serializers.CharField(source='group.module_type', read_only=True)
    student_username = serializers.CharField(source='student.username', read_only=True)
    student_full_name = serializers.SerializerMethodField()

    class Meta:
        model = GroupMembership
        fields = [
            'id', 'status', 'joined_at', 'completed_at',
            'group_id', 'group_name', 'course', 'module_type',
            'student_id', 'student_username', 'student_full_name'
        ]

    def get_student_full_name(self, obj):
        return ' '.join(filter(None, [obj.student.last_name, obj.student.first_name, getattr(obj.student, 'userprofile', None).middle_name if getattr(obj.student, 'userprofile', None) else None])) or obj.student.username


class StudyGroupSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)
    course = serializers.CharField(required=False, allow_blank=True)
    module_type = serializers.CharField(required=False, allow_blank=True)
    teacher_id = serializers.PrimaryKeyRelatedField(source='teacher', queryset=User.objects.filter(userprofile__role='teacher'), required=True)
    students_ids = serializers.PrimaryKeyRelatedField(source='students', queryset=User.objects.filter(userprofile__role='user'), many=True, required=False)
    teacher = serializers.CharField(source='teacher.username', read_only=True)
    students_count = serializers.IntegerField(source='students.count', read_only=True)
    students = serializers.SerializerMethodField()
    max_students = serializers.IntegerField(required=False, allow_null=True, min_value=0)
    start_date = serializers.DateField(required=False, allow_null=True)
    end_date = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = StudyGroup
        fields = [
            'id', 'slug', 'name', 'course', 'module_type', 'created_at', 'teacher',
            'teacher_id', 'students_ids', 'students_count', 'students',
            'max_students', 'start_date', 'end_date'
        ]

    def validate_max_students(self, value):
        if value == 0:
            return None
        return value

    def validate(self, attrs):
        max_students = attrs.get('max_students')
        students = attrs.get('students')

        if max_students and students is not None and len(students) > max_students:
            raise serializers.ValidationError(
                {"students_ids": f"Количество учеников ({len(students)}) превышает максимум ({max_students})"}
            )

        return attrs

    def get_students(self, obj):
        students = obj.students.select_related('userprofile').all()
        memberships = {
            m.student_id: m
            for m in GroupMembership.objects.filter(group=obj, status='active')
        }

        return [
            {
                'id': s.id,
                'username': s.username,
                'full_name': ' '.join(filter(None, [s.last_name, s.first_name, getattr(s, 'userprofile', None).middle_name if getattr(s, 'userprofile', None) else None])) or s.username,
                'membership_id': memberships.get(s.id).id if memberships.get(s.id) else None,
                'membership_status': memberships.get(s.id).status if memberships.get(s.id) else None,
            }
            for s in students
        ]

    def create(self, validated_data):
        students = validated_data.pop('students', [])

        group = StudyGroup.objects.create(**validated_data)

        if students:
            group.students.set(students)
            GroupMembership.objects.bulk_create([
                GroupMembership(group=group, student=s) for s in students
            ])

        return group

    def update(self, instance, validated_data):
        students = validated_data.pop('students', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if students is not None:
            old_ids = set(instance.students.values_list('id', flat=True))
            new_ids = set(s.id for s in students)

            instance.students.set(students)

            for sid in new_ids - old_ids:
                membership, _ = GroupMembership.objects.get_or_create(group=instance, student_id=sid)
                membership.status = 'active'
                membership.completed_at = None
                membership.save()

            for sid in old_ids - new_ids:
                GroupMembership.objects.filter(
                    group=instance, student_id=sid, status='active'
                ).update(status='left')

        return instance


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
    

class UserUpdateByAdminSerializer(serializers.ModelSerializer):
    middle_name = serializers.CharField(source='userprofile.middle_name', required=False, allow_blank=True, allow_null=True)
    phone = serializers.CharField(source='userprofile.phone', required=False, allow_blank=True, allow_null=True)
    role = serializers.CharField(source='userprofile.role', required=False)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'middle_name', 'phone', 'email', 'role']

    def validate_username(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(username__iexact=value).exists():
            raise serializers.ValidationError("Пользователь с таким именем уже существует")
        return value

    def validate_email(self, value):
        if not value:
            return value
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(email__iexact=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует")
        return value

    def validate_role(self, value):
        valid_roles = ['user', 'teacher', 'admin']
        if value not in valid_roles:
            raise serializers.ValidationError(f"Роль должна быть одной из: {', '.join(valid_roles)}")
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
            if 'role' in profile_data:
                profile.role = profile_data['role']
            profile.save()

        return instance


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
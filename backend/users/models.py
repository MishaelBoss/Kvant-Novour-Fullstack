from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
import uuid

def user_avatar_path(instance, filename):
    ext = filename.split('.')[-1].lower()
    hash = uuid.uuid4().hex[:8]
    return f'user/user_avatar_{instance.user.id}_{hash}.{ext}'

class UserProfile(models.Model):
    USER_ROLES = (
        ('student', 'Ученик'),
        ('parent', 'Родитель'),
        ('user', 'Пользователь'),
        ('teacher', 'Преподаватель'),
        ('admin', 'Администратор'),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='userprofile')
    role = models.CharField(max_length=10, choices=USER_ROLES, default='user')
    middle_name = models.CharField(max_length=150, null=True, blank=True)
    phone = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to=user_avatar_path, blank=True, null=True)
    is_public = models.BooleanField(default=True)

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            UserProfile.objects.get_or_create(user=instance)

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def save_user_profile(sender, instance, **kwargs):
        instance.userprofile.save()

    @property
    def is_admin(self):
        return self.role == 'admin' or self.user.is_superuser or self.user.is_staff

    @property
    def is_teacher(self):
        return self.role == 'teacher'
    
    @property
    def is_user(self):
        return self.role == 'user'
    
    @property
    def is_student(self):
        return self.role == 'student'

    @property
    def is_parent(self):
        return self.role == 'parent'
    
    def __str__(self):
        return self.user.username
    

class StudyGroup(models.Model):
    name = models.CharField(max_length=255)
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='teaching_groups', limit_choices_to={'userprofile__role': 'teacher'} )
    students = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='study_groups', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

class UserSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sessions')
    jti = models.CharField(max_length=255, unique=True, db_index=True, help_text="Уникальный ID JWT токена")
    ip_address = models.GenericIPAddressField()
    location = models.CharField(max_length=255, default="Неизвестно")
    browser = models.CharField(max_length=255)
    os = models.CharField(max_length=255)
    user_agent_string = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-last_activity']

    def __str__(self):
        return f"{self.user.username} - {self.browser} ({self.ip_address})"
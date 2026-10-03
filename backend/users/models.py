import re
import uuid
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

def user_avatar_path(instance, filename):
    hash = uuid.uuid4().hex[:8]
    return f'user/user_avatar_{instance.user.id}_{hash}.webp'

class UserProfile(models.Model):
    USER_ROLES = (
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
            profile, _ = UserProfile.objects.get_or_create(user=instance)
            if instance.is_superuser or instance.is_staff:
                profile.role = 'admin'
                profile.save()

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def save_user_profile(sender, instance, **kwargs):
        if hasattr(instance, 'userprofile'):
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
    
    def __str__(self):
        return self.user.username
    

class StudyGroup(models.Model):
    MODULE_CHOICES = [
        ('intro', 'Вводный модуль'),
        ('advanced', 'Углублённый модуль'),
        ('project', 'Проектный модуль'),
    ]

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, null=True, blank=True, verbose_name="Слаг для публичной страницы")
    course = models.CharField(max_length=100, blank=True, default='', verbose_name="Курс (слаг направления)")
    module_type = models.CharField(max_length=20, choices=MODULE_CHOICES, blank=True, default='', verbose_name="Тип модуля")
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='teaching_groups', limit_choices_to={'userprofile__role': 'teacher'} )
    max_students = models.PositiveIntegerField(null=True, blank=True, default=10, verbose_name="Максимум участников (0 — без лимита)")
    start_date = models.DateField(null=True, blank=True, verbose_name="Дата начала занятий")
    end_date = models.DateField(null=True, blank=True, verbose_name="Дата окончания занятий")
    start_time = models.TimeField(null=True, blank=True, verbose_name="Время начала занятий")
    created_at = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def _sanitize(value):
        value = re.sub(r'[^a-zA-Z0-9]+', '-', (value or '').lower())
        return re.sub(r'-+', '-', value).strip('-')

    def _build_slug(self):
        parts = [self.course or '', self.module_type or '', self._sanitize(self.name or '')]
        base = '-'.join(p for p in parts if p) or 'group'

        slug = base
        n = 2
        while True:
            qs = StudyGroup.objects.filter(slug=slug)
            if self.pk:
                qs = qs.exclude(pk=self.pk)
            if not qs.exists():
                return slug
            slug = f'{base}-{n}'
            n += 1

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._build_slug()
        super().save(*args, **kwargs)

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
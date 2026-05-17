from django.db import models
from django.conf import settings

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('system', 'Системное'),
        ('news', 'Новости'),
        ('chat', 'Связь с преподавателем')
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications', verbose_name='Получатель')
    type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES, default='news', verbose_name='Тип уведомления')
    title = models.CharField(max_length=255, verbose_name='Заголовок')
    description = models.TextField(verbose_name='Текст уведомления')
    is_read = models.BooleanField(default=False, verbose_name='Прочитано')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    def __str__(self):
        return f"{self.user.username} | {self.get_type_display()} | {self.title}"
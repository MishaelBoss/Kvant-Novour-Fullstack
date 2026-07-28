from django.db import models
from django.conf import settings
from news.models import News
from .tasks import clean_old_notifications
import logging

logger = logging.getLogger(__name__)

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
    news = models.ForeignKey(News, on_delete=models.CASCADE, null=True, blank=True, related_name='news', verbose_name='Новость')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        
        super().save(*args, **kwargs)

        if is_new:
            try:
                clean_old_notifications.delay(self.user_id, self.type)
            except Exception as exc:
                logger.error(
                    f"Celery error: не удалось запустить очистку уведомлений для user {self.user_id}: {exc}", 
                    exc_info=True
                )

    class Meta:
        verbose_name = 'Уведомление'
        verbose_name_plural = 'Уведомления'
        ordering = ['-created_at'] 
        indexes = [
            models.Index(fields=['user', 'type', '-created_at'])
        ]

    def __str__(self):
        return f"{self.user.username} | {self.get_type_display()} | {self.title}"
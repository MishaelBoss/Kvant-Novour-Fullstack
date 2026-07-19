from django.db import models
from django.conf import settings
from news.models import News

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
            queryset = Notification.objects.filter(
                user=self.user, 
                type=self.type
            ).order_by('-created_at')
            
            if queryset.count() > 10:
                ids_to_delete = list(queryset.values_list('id', flat=True)[10:])
                
                Notification.objects.filter(id__in=ids_to_delete).delete()

    def __str__(self):
        return f"{self.user.username} | {self.get_type_display()} | {self.title}"
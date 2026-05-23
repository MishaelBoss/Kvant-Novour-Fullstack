from rest_framework import serializers
from django.utils import timezone
from news.serializers import NewsSerializer
from .models import *


class NotificationSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    news = NewsSerializer(read_only=True) 

    class Meta:
        model = Notification
        fields = ['id', 'type', 'title', 'description', 'is_read', 'date', 'news']

    def get_date(self, obj):
        now = timezone.now()
        local_time = timezone.localtime(obj.created_at)
        
        if local_time.date() == now.date():
            return f"Сегодня, {local_time.strftime('%H:%M')}"
        elif local_time.date() == (now - timezone.timedelta(days=1)).date():
            return f"Вчера, {local_time.strftime('%H:%M')}"
        
        return local_time.strftime('%d.%m.%Y, %H:%M')
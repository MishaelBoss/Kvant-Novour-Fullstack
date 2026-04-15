from .models import *
from rest_framework import serializers

class NewsSerializer(serializers.ModelSerializer):
    form_slug = serializers.CharField(read_only=True)
    
    class Meta:
        model = News
        fields = ['id', 'title', 'content', 'image', 'created_at', 'categories', 'form_slug', 'form_id']
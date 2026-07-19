from .models import *
from rest_framework import serializers


class CategorySerializer(serializers.ModelSerializer):
    value = serializers.IntegerField(source='id')
    label = serializers.CharField(source='name')

    class Meta:
        model = Category
        fields = ['value', 'label', 'slug']


class NewsSerializer(serializers.ModelSerializer):
    form_slug = serializers.CharField(read_only=True)
    form_id = serializers.PrimaryKeyRelatedField(source='form', read_only=True)
    categories = CategorySerializer(many=True, read_only=True) 
    
    class Meta:
        model = News
        fields = ['id', 'title', 'content', 'image', 'created_at', 'categories', 'form_slug', 'form_id', 'categories']
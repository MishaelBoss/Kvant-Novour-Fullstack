from .models import *
from rest_framework import serializers


class CategorySerializer(serializers.ModelSerializer):
    value = serializers.IntegerField(source='id', read_only=True)
    label = serializers.CharField(source='name')

    class Meta:
        model = Category
        fields = ['value', 'label', 'slug']


class NewsSerializer(serializers.ModelSerializer):
    form_slug = serializers.CharField(read_only=True)
    form_id = serializers.PrimaryKeyRelatedField(source='form', read_only=True)
    categories = CategorySerializer(many=True, read_only=True) 
    category_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    
    class Meta:
        model = News
        fields = [
            'id', 'title', 'content', 'image', 'created_at',
            'categories', 'category_ids', 'form_slug', 'form_id',
        ]

    def create(self, validated_data):
        category_ids = validated_data.pop('category_ids', [])
        news = News.objects.create(**validated_data)
        if not category_ids:
            default_category, _ = Category.objects.get_or_create(name="Новости")
            category_ids = [default_category.id]

        news.categories.set(category_ids)
        return news
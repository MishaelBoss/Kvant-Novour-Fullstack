import os
from .models import *
from rest_framework import serializers
from PIL import Image, ImageOps
from io import BytesIO
from django.core.files.base import ContentFile
from django.db.models import F


class CategorySerializer(serializers.ModelSerializer):
    value = serializers.IntegerField(source='id', read_only=True)
    label = serializers.CharField(source='name')

    class Meta:
        model = Category
        fields = ['value', 'label', 'slug']
        read_only_fields = ['slug'] 

    def create(self, validated_data):
        category_name  = validated_data.get('name')
        category, created = Category.objects.get_or_create(name=category_name )

        return category


class NewsSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(read_only=True)
    form_id = serializers.PrimaryKeyRelatedField(source='form', read_only=True)
    categories = CategorySerializer(many=True, read_only=True) 
    category_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    image = serializers.ImageField(required=True, allow_null=True)
    is_viewed = serializers.SerializerMethodField()

    class Meta:
        model = News
        fields = [
            'id', 'title', 'content', 'image', 'created_at',
            'categories', 'category_ids', 'slug', 'form_id',
            'views', 'is_viewed'
        ]

    def get_is_viewed(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user and getattr(user, 'is_authenticated', False):
            return obj.views_records.filter(user=user).exists()
        return False

    def validate_image(self, value):
            if value:
                max_size = 5 * 1024 * 1024 
                if value.size > max_size:
                    raise serializers.ValidationError("Размер файла не должен превышать 5 МБ.")
    
                valid_mime_types = ['image/jpeg', 'image/png', 'image/webp']
                if value.content_type not in valid_mime_types:
                    raise serializers.ValidationError("Файл не является валидным изображением.")
    
            return value

    def _convert_image(self, image):
        if not image:
            return None
            
        img = Image.open(image)

        if img.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1])
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        img = ImageOps.fit(img, (800, 450), Image.Resampling.LANCZOS)

        output_buffer = BytesIO()
        img.save(output_buffer, format='WEBP', quality=85)
        output_buffer.seek(0)

        return ContentFile(output_buffer.read(), name=f"news_{os.urandom(4).hex()}.webp")

    def create(self, validated_data):
        category_ids = validated_data.pop('category_ids', [])
        image = validated_data.pop('image', None)

        if not category_ids:
            default_category, _ = Category.objects.get_or_create(name="Новости")
            category_ids = [default_category.id]

        if image:
            validated_data['image'] = self._convert_image(image)

        news = News.objects.create(**validated_data)
        news.categories.set(category_ids)
        news.views = 0
        return news

    def update(self, validated_data, instance):
        category_ids = validated_data.pop('category_ids', None)
        image = validated_data.pop('image', None)

        if not category_ids:
            default_category, _ = Category.objects.get_or_create(name="Новости")
            category_ids = [default_category.id]
        
        if image:
            if instance.image and os.path.isfile(instance.image.path):
                try:
                    os.remove(instance.image.path)
                except Exception as ex:
                    print(f"Не удалось удалить старый файл: {ex}")
            instance.image = self._process_image(image)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if category_ids is not None:
            if not category_ids:
                default_category, _ = Category.objects.get_or_create(name="Новости")
                category_ids = [default_category.id]
            instance.categories.set(category_ids)
        return instance


class ViewNewsSerializer(serializers.ModelSerializer):
    views = serializers.IntegerField(read_only=True)

    class Meta:
        model = News
        fields = ['views']

    def update(self, instance, validated_data):
        News.objects.filter(pk=instance.pk).update(views=F('views') + 1)
        
        instance.refresh_from_db()
        return instance
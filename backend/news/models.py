from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from pytils.translit import slugify
from forms.models import * 
from transliterate import translit

def news_image_path(instance, filename):
    ext = filename.split('.')[-1].lower()
    return f'news/news_{instance.title}.{ext}'

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            latin_name = translit(self.name, 'ru', reversed=True)
            self.slug = slugify(latin_name)
        super().save(*args, **kwargs)

class News(models.Model):
    title = models.CharField(max_length=200, unique=True)
    content = models.TextField()
    categories = models.ManyToManyField(Category)
    image = models.ImageField(upload_to=news_image_path, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name='news', null=True, blank=True)
    form_slug = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.title

    def get_average_rating(self):
        return self.ratings.aggregate(models.Avg('value'))['value__avg'] or 0
    

class Comment(models.Model):
    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Rating(models.Model):
    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    value = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    class Meta:
        unique_together = ('news', 'user') 
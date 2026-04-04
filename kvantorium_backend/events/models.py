from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='created_products')
    title = models.CharField(max_length=150)
    image = models.ImageField(upload_to='images')
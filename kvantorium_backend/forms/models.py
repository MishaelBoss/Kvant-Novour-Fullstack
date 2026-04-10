from django.db import models
from django.conf import settings
import uuid

class Form(models.Model):
    STATUS = [
        ('draft', 'черновик'),
        ('active', 'активна'),
        ('closed', 'закрыта'),
    ]
    
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='forms')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    slug = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deadline = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.title}"
    
class Question(models.Model):
    TYPE = [
        ('short_text', 'Короткий текст'),
        ('long_text', 'Длинный текст'),
        ('radio', 'Один вариант'),
        ('checkbox', 'Несколько вариантов'),
        ('dropdown', 'Выпадающий список'),
        ('number', 'Число'),
    ]

    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name='questions')
    text = models.CharField(max_length=500)
    type = models.CharField(max_length=20, choices=TYPE)
    is_required = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    points = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"[{self.form.title}] {self.text}"
    
class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    text = models.CharField(max_length=300)
    order = models.PositiveIntegerField(default=0)
    is_correct = models.BooleanField(default=False)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.text}"
    
class Response(models.Model):
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name='responses')
    respondent_name = models.CharField(max_length=200, blank=True)
    respondent_email = models.EmailField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    total_score = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.form.title} — {self.respondent_name or 'Аноним'}"
    
class Answer(models.Model):
    response = models.ForeignKey(Response, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text_value = models.TextField(blank=True)
    selected_choices = models.ManyToManyField(Choice, blank=True)

    def __str__(self):
        return f"Ответ на: {self.question.text}"
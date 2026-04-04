from django.contrib import admin
from .models import *

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    filter_horizontal = ('categories',)
    list_display = ('title', 'created_at')

admin.site.register(Category)
admin.site.register(Comment)
admin.site.register(Rating)
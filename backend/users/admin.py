from django.contrib import admin
from .models import *

admin.site.site_header = "Панель администратора Kvantum"
admin.site.register(UserProfile)
admin.site.register(StudyGroup)
admin.site.register(UserSession)

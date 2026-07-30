from django.contrib import admin
from .models import AttendanceRecord


@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ['student', 'group', 'date', 'status', 'created_at']
    list_filter = ['status', 'date', 'group']
    search_fields = ['student__username', 'student__last_name', 'group__name']
    date_hierarchy = 'date'

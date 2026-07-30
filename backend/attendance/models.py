from django.db import models
from django.conf import settings


class AttendanceRecord(models.Model):
    STATUS = [
        ('present', 'Присутствовал'),
        ('absent', 'Отсутствовал'),
        ('late', 'Опоздал'),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    group = models.ForeignKey(
        'users.StudyGroup', on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS, default='present')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', 'student__last_name']
        unique_together = ['student', 'group', 'date']

    def __str__(self):
        return f"{self.student.username} — {self.group.name} — {self.date} ({self.get_status_display()})"

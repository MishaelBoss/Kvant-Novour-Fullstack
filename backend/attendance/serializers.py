from rest_framework import serializers
from .models import AttendanceRecord


class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='student.username', read_only=True)
    student_full_name = serializers.SerializerMethodField()
    group_name = serializers.CharField(source='group.name', read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'student', 'student_username', 'student_full_name',
            'group', 'group_name', 'date', 'status', 'notes',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_student_full_name(self, obj):
        parts = [obj.student.last_name or '', obj.student.first_name or '', obj.student.userprofile.middle_name or '']
        return ' '.join(p for p in parts if p)

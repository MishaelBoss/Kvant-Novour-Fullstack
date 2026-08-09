from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from datetime import datetime
from .models import AttendanceRecord
from .serializers import AttendanceRecordSerializer
from users.permissions import IsAdminOrTeacher
from users.models import StudyGroup


def can_manage_group(request, group):
    if request.user.is_superuser or request.user.is_staff:
        return True

    profile = getattr(request.user, 'userprofile', None)
    if profile and profile.role == 'admin':
        return True

    if profile and profile.role == 'teacher' and group.teacher_id == request.user.id:
        return True

    return False


class CreateAttendanceView(APIView):
    permission_classes = [IsAdminOrTeacher]
    
    def post(self, request):
        group_id = request.data.get('group')
        if not group_id:
            return Response({'error': 'Поле group обязательно'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            group = StudyGroup.objects.get(id=group_id)
        except StudyGroup.DoesNotExist:
            return Response({'error': 'Группа не найдена'}, status=status.HTTP_404_NOT_FOUND)

        if not can_manage_group(request, group):
            return Response({'error': 'Нет доступа к этой группе'}, status=status.HTTP_403_FORBIDDEN)

        student = get_object_or_404(get_user_model(), id=request.data.get('student'))
        date = request.data.get('date')
        status_value = request.data.get('status', 'present')
        notes = request.data.get('notes')

        if not date:
            return Response({'error': 'Поле date обязательно'}, status=status.HTTP_400_BAD_REQUEST)

        if status_value not in {'present', 'absent', 'late'}:
            return Response({'error': 'Некорректный статус посещаемости'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            parsed_date = datetime.strptime(date, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            return Response({'error': 'Некорректная дата, ожидается формат ГГГГ-ММ-ДД'}, status=status.HTTP_400_BAD_REQUEST)

        record, created = AttendanceRecord.objects.update_or_create(
            student=student,
            group=group,
            date=parsed_date,
            defaults={
                'status': status_value,
                'notes': notes,
            }
        )

        return Response(AttendanceRecordSerializer(record).data, status=status.HTTP_201_CREATED)
    
class AttendanceListView(APIView):
    permission_classes = [IsAdminOrTeacher]

    def get(self, request):
        qs = AttendanceRecord.objects.select_related(
            'student', 'student__userprofile', 'group'
        ).all()

        profile = getattr(request.user, 'userprofile', None)
        if not (request.user.is_superuser or request.user.is_staff or (profile and profile.role == 'admin')):
            qs = qs.filter(group__teacher=request.user)

        group_id = request.query_params.get('group')
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        student_id = request.query_params.get('student')

        if group_id:
            qs = qs.filter(group_id=group_id)
        if date_from:
            qs = qs.filter(date__gte=date_from)
        if date_to:
            qs = qs.filter(date__lte=date_to)
        if student_id:
            qs = qs.filter(student_id=student_id)

        serializer = AttendanceRecordSerializer(qs, many=True)
        return Response({"results": serializer.data})


class AttendanceDetailView(APIView):
    permission_classes = [IsAdminOrTeacher]

    def get_object(self, pk):
        return get_object_or_404(
            AttendanceRecord.objects.select_related(
                'student', 'student__userprofile', 'group'
            ),
            pk=pk
        )

    def _check_access(self, request, record):
        if not can_manage_group(request, record.group):
            return Response({'error': 'Нет доступа к этой группе'}, status=status.HTTP_403_FORBIDDEN)
        return None

    def get(self, request, pk):
        record = self.get_object(pk)
        error = self._check_access(request, record)
        if error:
            return error
        serializer = AttendanceRecordSerializer(record)
        return Response(serializer.data)

    def patch(self, request, pk):
        record = self.get_object(pk)
        error = self._check_access(request, record)
        if error:
            return error
        serializer = AttendanceRecordSerializer(record, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        record = self.get_object(pk)
        error = self._check_access(request, record)
        if error:
            return error
        record.delete()
        return Response({"message": "Запись удалена"}, status=status.HTTP_200_OK)

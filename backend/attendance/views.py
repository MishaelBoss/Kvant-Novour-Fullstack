from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import AttendanceRecord
from .serializers import AttendanceRecordSerializer
from users.permissions import IsAdminOrTeacher


class CreateAttendanceView(APIView):
    permission_classes = [IsAdminOrTeacher]
    
    def post(self, request):
            serializer = AttendanceRecordSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AttendanceListView(APIView):
    permission_classes = [IsAdminOrTeacher]

    def get(self, request):
        qs = AttendanceRecord.objects.select_related(
            'student', 'student__userprofile', 'group'
        ).all()

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

    def get(self, request, pk):
        record = self.get_object(pk)
        serializer = AttendanceRecordSerializer(record)
        return Response(serializer.data)

    def patch(self, request, pk):
        record = self.get_object(pk)
        serializer = AttendanceRecordSerializer(record, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        record = self.get_object(pk)
        record.delete()
        return Response({"message": "Запись удалена"}, status=status.HTTP_200_OK)

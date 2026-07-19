from .models import *
from rest_framework import serializers

class FormSerializer(serializers.ModelSerializer):
    responses_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Form
        fields = ['id', 'title', 'description', 'status', 'created_at', 'responses_count']
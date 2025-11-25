from rest_framework import serializers
from .models import File

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'owner', 'file', 'file_name', 'size', 'uploaded_at']
        read_only_fields = ['owner', 'uploaded_at']

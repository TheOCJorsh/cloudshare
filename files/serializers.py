from rest_framework import serializers
from .models import File
from rest_framework import serializers
from django.conf import settings

class FileSerializer(serializers.ModelSerializer):
    share_link = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = ['id', 'original_name', 'size', 'uploaded_at', 'share_link']
        read_only_fields = ['owner', 'uploaded_at']

    def get_share_link(self, obj):
        base_url = "https://cloudshare-production-eb41.up.railway.app"
        return f"{base_url}/api/files/share/{obj.share_token}/"

from django.contrib import admin
from .models import File

@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('file_name', 'owner', 'size', 'uploaded_at')
    search_fields = ('file_name', 'owner__username')
    list_filter = ('uploaded_at',)

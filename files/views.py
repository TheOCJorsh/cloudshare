from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from .models import File
from .serializers import FileSerializer
from django.http import FileResponse, Http404

    
# ✅ Upload File
class FileUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return Response({'error': 'No file provided'}, status=400)
        
        file_obj = File.objects.create(
            owner=request.user,
            file=uploaded_file,
            file_name=uploaded_file.name,
            size=uploaded_file.size
        )
        return Response({'message': 'File uploaded successfully', 'id': file_obj.id})

# ✅ List all uploaded files for a user
class FileListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        files = File.objects.filter(owner=request.user)
        data = []

        for f in files:
            data.append({
                "id": f.id,
                "file": f.file.url,
                "file_name": f.file_name,
                "size": f.size,
                "uploaded_at": f.uploaded_at,
                "share_token": f.share_token(),  # 👈 IMPORTANT
            })

        return Response(data)

# ✅ Delete a specific file
class FileDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            file_obj = File.objects.get(pk=pk, owner=request.user)
            file_obj.file.delete(save=False)  # deletes the physical file
            file_obj.delete()                 # deletes the DB record
            return Response({'message': 'File deleted successfully'})
        except File.DoesNotExist:
            return Response({'error': 'File not found'}, status=404)

# ✅ Create initial superuser (optional helper endpoint)
@api_view(["POST"])
def create_initial_superuser(request):
    if User.objects.filter(is_superuser=True).exists():
        return Response({"error": "Superuser already exists"}, status=400)

    User.objects.create_superuser(
        username="admin",
        email="admin@example.com",
        password="AdminPass123!"
    )
    return Response({"message": "Superuser created successfully"})

import base64
import os
from django.http import FileResponse, Http404

def public_download_view(request, token):
    try:
        decoded = base64.urlsafe_b64decode(token.encode()).decode()
        file_id, filename = decoded.split("|")
        file = File.objects.get(id=file_id)
    except:
        raise Http404("Invalid or expired link.")

    if not file or not os.path.exists(file.file.path):
        raise Http404("File not found.")

    return FileResponse(
        open(file.file.path, "rb"),
        as_attachment=True,
        filename=filename
    )

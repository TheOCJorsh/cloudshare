from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import File
from .serializers import FileSerializer

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
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data)

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

from django.contrib.auth.models import User
from django.http import JsonResponse

def create_initial_superuser(request):
    if User.objects.filter(username="admin").exists():
        return JsonResponse({"message": "Admin already exists"})

    User.objects.create_superuser(
        username="admin",
        password="Admin12345",
        email="admin@example.com"
    )

    return JsonResponse({"message": "Admin user created successfully!"})

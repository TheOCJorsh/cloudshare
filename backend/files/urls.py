from django.urls import path
from .views import (
    FileUploadView,
    FileListView,
    FileDeleteView,
    create_initial_superuser
)

urlpatterns = [
    path("upload/", FileUploadView.as_view(), name="upload"),
    path("list/", FileListView.as_view(), name="list_files"),
    path("delete/<int:pk>/", FileDeleteView.as_view(), name="delete_file"),
    
    # Optional helper endpoint to create admin user
    path("create-admin/", create_initial_superuser, name="create_admin"),
]

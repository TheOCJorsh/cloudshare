from django.urls import path
from .views import upload_file, list_files, create_initial_superuser

urlpatterns = [
    path("upload/", upload_file),
    path("list/", list_files),
    path("init-admin/", create_initial_superuser),  # TEMPORARY
]

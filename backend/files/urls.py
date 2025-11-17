from django.urls import path
from .views import FileUploadView, FileListView, FileDeleteView

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('list/', FileListView.as_view(), name='file-list'),
    path('delete/<int:pk>/', FileDeleteView.as_view(), name='file-delete'),
]

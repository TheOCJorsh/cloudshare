from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from .views import home
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Landing Page
    path("", home, name="home"),

    # Admin Panel
    path("admin/", admin.site.urls),

    # File Sharing APIs
    path("api/files/", include("files.urls")),

    # JWT Authentication
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]

# Serve media files (uploads)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from .run_migrations import migrate

urlpatterns += [
    path("run-migrations/", migrate, name="run_migrations"),
]

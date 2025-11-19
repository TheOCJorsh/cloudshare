import subprocess
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt

def home_view(request):
    return render(request, 'home.html')

# --- RUN MIGRATIONS (Render-friendly) ---
def run_migrations_view(request):
    try:
        subprocess.run(["python3", "manage.py", "migrate"], check=True)
        return HttpResponse("Migrations completed successfully.")
    except Exception as e:
        return HttpResponse(f"Migration failed: {e}")

# --- CREATE ADMIN SUPERUSER (Render-friendly, no shell required) ---
@csrf_exempt
def create_admin_view(request):
    User = get_user_model()

    # DO NOT recreate if already exists
    if User.objects.filter(username="admin").exists():
        return HttpResponse("Admin user already exists.")

    try:
        User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="AdminPass123!"
        )
        return HttpResponse("Admin user created successfully.")
    except Exception as e:
        return HttpResponse(f"Error creating admin user: {e}")

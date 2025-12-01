📌 CloudShare — Secure Cloud Storage & File Transfer System.

This is a modern, lightweight, and secure cloud-based file-sharing system built with Django (Backend) and Vanilla JavaScript (Frontend).
The platform allows users to upload, download, and manage files safely using JWT authentication, PostgreSQL, and a clean frontend interface.
__________________________________________________________________________

🚀 Live Demo Links
Component	            URL
Frontend (Render)	    https://cloudshare-frontend.onrender.com

Backend API (Railway)	https://cloudshare-production-eb41.up.railway.app
__________________________________________________________________________
📂 Core Features

🔐 Authentication.
Secure login using JWT (access + refresh tokens)
Tokens stored safely in browser storage
1-hour access token, 7-day refresh token

📁 File Management.
Upload any file type
Download stored files securely
Delete files with confirmation
File metadata stored in Neon PostgreSQL
Drag-and-drop upload supported in future versions

🗄️ Database.
Neon PostgreSQL (cloud-based, scalable)
Django ORM for models
Automatic migrations on deployment
__________________________________________________________________________
📡 REST API Endpoints

Action	            Endpoint
Login	            /api/token/
Refresh Token	    /api/token/refresh/
Upload File	        /api/files/upload/
List Files	        /api/files/list/
Delete File	        /api/files/delete/<id>/
__________________________________________________________________________
🛠️ Tech Stack

⚙️Backend.
Django 5.x
Django REST Framework
PostgreSQL (Neon)
SimpleJWT
Gunicorn
Whitenoise

⚙️Frontend.
HTML5
CSS3
JavaScript (ES6)
Fetch API

⚙️Deployment
Backend: Railway
Frontend: Render
Database: Neon PostgreSQL
__________________________________________________________________________
📂 Project Structure.

cloudshare/
├── cloudshare_proj/
── settings.py ── urls.py ── views.py ── wsgi.py
├── files/ ── models.py ── views.py ── serializers.py ── urls.py ── migrations/
├── templates/ ── home.html
├── Frontend(static)/
├── manage.py
├── requirements.txt
├── Procfile
└── README.md
__________________________________________________________________________
💾 Local Development Setup

1️⃣ Clone the repository.
git clone https://github.com/TheOCJorsh/cloudshare.git
cd cloudshare

2️⃣ Create virtual environment.
python -m venv venv
source venv/bin/activate   --> Mac/Linux
venv\Scripts\activate      --> Windows

3️⃣ Install packages
pip install -r requirements.txt

4️⃣ Apply migrations
python manage.py migrate

5️⃣ Create a superuser
python manage.py createsuperuser

6️⃣ Run server
python manage.py runserver
__________________________________________________________________________
🧪 API Testing.

Options:
Postman - Thunder Client - cURL

Request example:

curl -X POST https://cloudshare-production-eb41.up.railway.app/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "AdminPass123!"}'

__________________________________________________________________________
🔒 Security Notes.

All API routes (except login) require a valid JWT token
Static files served via Whitenoise
CORS configured properly
Environment variables used for secrets
__________________________________________________________________________
📝 Author.

Joshua OC Oghegha
Project & Data Analyst | Software Developer & Cloud Solutions Builder
Email: ogheghajoshua@gmail.com
<p align="center">
<a href="https://www.linkedin.com/in/oghegha-joshua-62b402105/" target="_blank">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" width="40" height="40"/>
  </a>
  &nbsp;
  <a href="https://wa.me/2347065527642" target="_blank">
    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="40" height="40"/>
  </a>
  &nbsp;
  <a href="mailto:ogheghajoshua@gmail.com" target="_blank">
    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png" alt="Email" width="40" height="40"/>
  </a>
</p>

If this project inspires you, give it a star ⭐ on GitHub!
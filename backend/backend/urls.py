"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import hello_api,register_user,jwt_login,job_list,apply_job,applyed_list,application_detail,forgot_password,reset_password,my_profile,update_resume
from . import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path("hello/",hello_api),
    path("register",register_user),
    path("login",jwt_login),
    path("jobs",job_list),
    path("apply",apply_job),
    path("my-application/",applyed_list),
    path('my-application/<int:pk>/',application_detail),
    path('forgot-password/', forgot_password),
    path('reset-password/<str:token>/', reset_password),
    path('my-profile',my_profile),
    path('update-resume',update_resume),
    path("api/resume-check/", views.resume_checker),
    path("api/mock-interview/", views.mock_interview),
    path("api/skill-gap/", views.skill_gap),
    path("api/build-resume/", views.resume_builder),
    path("api/voice-interview/", views.voice_interview),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

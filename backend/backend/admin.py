from django.contrib import admin
from .models import Job, Application

# Minimal registration so models appear in the Django admin.
admin.site.register(Job)
admin.site.register(Application)

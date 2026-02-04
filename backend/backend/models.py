
from django.db import models
from django.contrib.auth.models import User

class Job(models.Model):
    EXPERIENCE_CHOICES = [
        ("0-1", "0-1 years (Fresher)"),
        ("1-3", "1-3 years (Junior)"),
        ("3-5", "3-5 years (Mid-level)"),
        ("5-8", "5-8 years (Senior)"),
        ("8+", "8+ years (Lead)"),
    ]

    title=models.CharField(max_length=200)
    description=models.TextField()
    experience=models.CharField(max_length=10,choices=EXPERIENCE_CHOICES)
    company=models.CharField(max_length=100)
    location=models.CharField(max_length=100)
    salary_range=models.CharField(max_length=50, blank=True)
    posted_on=models.DateTimeField(auto_now_add=True)
    created_by=models.ForeignKey(User,on_delete=models.CASCADE)
class Application(models.Model):
    STATUS_CHOICE = (
         ('pending','Pending'),
         ('shortlisted','ShortListed'),
         ('rejected','Rejected'),
         ('hired','Hired'),
    )
    job=models.ForeignKey(Job,on_delete=models.CASCADE)
    applicant=models.ForeignKey(User,on_delete=models.CASCADE)
    status=models.CharField(max_length=20,choices=STATUS_CHOICE, default='pending')
    applied_on=models.DateTimeField(auto_now_add=True)



from django.db import models
from django.contrib.auth.models import User

class Job(models.Model):
    title=models.CharField(max_length=200)
    description=models.TextField()
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


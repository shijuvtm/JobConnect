from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Job,Application

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)  # Ensure password is write-only

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # Use create_user to hash password correctly
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user        
class JobsSerializer(serializers.ModelSerializer):
    created_by=serializers.StringRelatedField()
    
    class Meta:
        model=Job
        fields="__all__"
        
class ApplicationSerializer(serializers.ModelSerializer):
    job_title=serializers.CharField(source="job.title",read_only=True)
    company=serializers.CharField(source="job.compamy",read_only=True)
    location=serializers.CharField(source="job.location",read_only=True)
    experience=serializers.CharField(source="job.experience",read_only=True)
    salary=serializers.CharField(source="job.salary_range",read_only=True)
    job_description = serializers.CharField(source="job.description", read_only=True)
    applicant_name = serializers.CharField(source="applicant.username", read_only=True)
      
    class Meta:
       model=Application
       fields="__all__"

   

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Job,Application,Profile
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from datetime import datetime

class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15)
    password = serializers.CharField(write_only=True)
    degree = serializers.CharField(max_length=100)
    university = serializers.CharField(max_length=150)
    graduation_year = serializers.IntegerField()
    work_type = serializers.CharField()
    expected_salary = serializers.IntegerField()
    skills = serializers.CharField()
    resume = serializers.FileField(required=False)
   
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value

  
    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

  
    def validate_phone(self, value):
        if not value.isdigit() or len(value) < 10:
            raise serializers.ValidationError("Enter a valid phone number")
        return value

    
    def validate_graduation_year(self, value):
        current_year = datetime.now().year
        if value < 1990 or value > current_year + 1:
            raise serializers.ValidationError("Enter a valid graduation year")
        return value

    def create(self, validated_data):
        resume = validated_data.pop('resume',None)
        name_parts = validated_data['full_name'].split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        user = User.objects.create_user(
            username=validated_data['full_name'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name,
        )

        Profile.objects.create(
            user=user,
            phone=validated_data['phone'],
            degree=validated_data['degree'],
            university=validated_data['university'],
            graduation_year=validated_data['graduation_year'],
            work_type=validated_data['work_type'],
            expected_salary=validated_data['expected_salary'],
            skills=validated_data['skills'],
            resume=resume
        )

        return user        
class JobsSerializer(serializers.ModelSerializer):
    created_by=serializers.StringRelatedField()
    
    class Meta:
        model=Job
        fields="__all__"
        
class ApplicationSerializer(serializers.ModelSerializer):
    job_title=serializers.CharField(source="job.title",read_only=True)
    company=serializers.CharField(source="job.company",read_only=True)
    location=serializers.CharField(source="job.location",read_only=True)
    experience=serializers.CharField(source="job.experience",read_only=True)
    salary=serializers.CharField(source="job.salary_range",read_only=True)
    job_description = serializers.CharField(source="job.description", read_only=True)
    applicant_name = serializers.CharField(source="applicant.username", read_only=True)
      
    class Meta:
       model=Application
       fields="__all__"

   
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

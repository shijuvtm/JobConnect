from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Job,Application,Profile
from .models import RecruiterProfile
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
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
    resume = serializers.FileField(required=True)
   
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
        if Profile.objects.filter(phone=value).exists():
            raise serializers.ValidationError("This phone number is already registered")
        return value

    
    def validate_graduation_year(self, value):
        current_year = datetime.now().year
        if value < 1990 or value > current_year + 1:
            raise serializers.ValidationError("Enter a valid graduation year")
        return value
    def validate_resume(self, value):
        if not value.name.endswith('.pdf'):
            raise serializers.ValidationError("Only PDF files are allowed")
        return value


    def create(self, validated_data):
        try:
            print("STEP 1")
            resume = validated_data.pop('resume', None)
    
            print("STEP 2")
            full_name = validated_data['full_name']
    
            print("STEP 3")
            user = User.objects.create_user(
                username=validated_data['email'],
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=full_name,
            )
    
            print("STEP 4")
            Profile.objects.create(
                user=user,
                phone=validated_data['phone'],
                degree=validated_data['degree'],
                university=validated_data['university'],
                graduation_year=validated_data['graduation_year'],
                work_type=validated_data['work_type'],
                expected_salary=validated_data['expected_salary'],
                skills=validated_data['skills'],
                resume=resume,
            )
    
            print("STEP 5")
            return user
    
        except Exception as e:
            print("ERROR:", str(e))
            raise
class EmployerRegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    mobile = serializers.CharField(max_length=15)
    password = serializers.CharField(write_only=True)
    company_name = serializers.CharField(max_length=200)
    company_email = serializers.EmailField(required=False, allow_blank=True)
    designation = serializers.CharField(max_length=150, required=False, allow_blank=True)
    website = serializers.URLField(required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as error:
            raise serializers.ValidationError(error.messages)
        return value

    def validate_mobile(self, value):
        if not value.isdigit() or len(value) < 10:
            raise serializers.ValidationError("Enter a valid mobile number")
        return value

    @transaction.atomic
    def create(self, validated_data):
        full_name = validated_data.pop("full_name")
        password = validated_data.pop("password")
        email = validated_data.pop("email")
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=full_name,
        )
        RecruiterProfile.objects.create(
            user=user,
            full_name=full_name,
            mobile=validated_data.pop("mobile"),
            **validated_data,
        )
        return user


class JobsSerializer(serializers.ModelSerializer):
    created_by=serializers.StringRelatedField()
    
    class Meta:
        model=Job
        fields="__all__"


class EmployerJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ("id", "title", "description", "experience", "location", "salary_range")

    def validate_experience(self, value):
        if value not in dict(Job.EXPERIENCE_CHOICES):
            raise serializers.ValidationError("Select a valid experience range")
        return value
        
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

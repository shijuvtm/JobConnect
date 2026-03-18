from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
from .models import Application, Job,Profile
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.core.mail import send_mail
from .serializers import ApplicationSerializer, JobsSerializer, RegisterSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def hello_api(request):
    return Response({"message":"Hello from Django API"})

@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message":"User Registered Successfully!"}, status=status.HTTP_201_CREATED)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def jwt_login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user_obj = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"message": "User with this email does not exist"},
            status=status.HTTP_404_NOT_FOUND
        )

    user = authenticate(username=user_obj.username, password=password)

    if user is None:
        return Response(
            {"message": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "Login successful",
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get("email")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"message": "User with this email does not exist"},
            status=status.HTTP_404_NOT_FOUND
        )

    payload = {
        "user_id": user.id,
        "exp": datetime.utcnow() + timedelta(minutes=10),
        "iat": datetime.utcnow(),
        "type": "password_reset"
    }

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

    reset_link = f"https://jobconnect-1ofu.onrender.com/reset-password/{token}/"

    send_mail(
        "Password Reset",
        f"Click the link to reset your password:\n{reset_link}",
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )

    return Response(
        {"message": "Password reset link sent to email"},
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request, token):

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

        if payload["type"] != "password_reset":
            return Response(
                {"message": "Invalid token type"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.get(id=payload["user_id"])

    except jwt.ExpiredSignatureError:
        return Response(
            {"message": "Token expired"},
            status=status.HTTP_400_BAD_REQUEST
        )

    except jwt.InvalidTokenError:
        return Response(
            {"message": "Invalid token"},
            status=status.HTTP_400_BAD_REQUEST
        )

    new_password = request.data.get("password")

    if not new_password:
        return Response(
            {"message": "Password is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)
    user.save()

    return Response(
        {"message": "Password reset successful"},
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def job_list(request):
    jobs = Job.objects.all()
    serializer = JobsSerializer(jobs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_job(request):
    serializer = ApplicationSerializer(data=request.data)

    job_id = request.data.get("job")
    applicant = request.user  #  JWT user

    # Prevent duplicate application
    if Application.objects.filter(job_id=job_id, applicant=applicant).exists():
        return Response(
            {"message": "You already have applied!"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if serializer.is_valid():
        serializer.save(applicant=applicant)
        return Response(
            {"message": "Application Submitted"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def applyed_list(request):
    applications=Application.objects.filter(applicant=request.user).order_by("-applied_on")
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def application_detail(request, pk):
    try:
        
        application = Application.objects.get(pk=pk, applicant=request.user)
        serializer = ApplicationSerializer(application)
        return Response(serializer.data)
    except Application.DoesNotExist:
        return Response(
            {"message": "Application not found or unauthorized"}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_profile(request):
    try:
        profile = Profile.objects.get(user=request.user)

        data = {
            "id": profile.id,
            "phone": profile.phone,
            "degree": profile.degree,
            "university": profile.university,
            "resume": profile.resume.url if profile.resume else None

        }
        
        return Response(data, status=status.HTTP_200_OK)

    except backend_profile.DoesNotExist:
        return Response(
            {"message": "Profile not found"},
            status=status.HTTP_404_NOT_FOUND
        )
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_resume(request):
    try:
        profile = Profile.objects.get(user=request.user)

        file = request.FILES.get('resume')

        if not file:
            return Response(
                {"error": "No file uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        #  Validate file type (PDF only)
        if not file.name.endswith('.pdf'):
            return Response(
                {"error": "Only PDF files are allowed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Delete old resume (important)
        if profile.resume:
            profile.resume.delete(save=False)

        #  Save new file
        profile.resume = file
        profile.save()

        return Response({
            "message": "Resume updated successfully",
            "resume": profile.resume.url  
        }, status=status.HTTP_200_OK)

    except Profile.DoesNotExist:
        return Response(
            {"error": "Profile not found"},
            status=status.HTTP_404_NOT_FOUND
        )

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from .models import Application, Job

from .serializers import ApplicationSerializer, JobsSerializer, RegisterSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def hello_api(request):
    return Response({"message":"Hello from Django API"})

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)   
    if serializer.is_valid():
        serializer.save() #saves user
        return Response({"message":"User Registered Successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def jwt_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"message": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": {
            "id": user.id,
            "username": user.username
        }
    }, status=status.HTTP_200_OK)

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

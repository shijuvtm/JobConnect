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
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .services.ai_service import generate_ai_response
#from django.core.mail import send_mail
from .utils import send_brevo_email
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

    # Use the configured frontend URL (e.g., localhost:5173 for local dev)
    reset_link = f"{settings.FRONTEND_URL}/reset-password/{token}/"

    email_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h3 style="color: #333;">Password Reset Request</h3>
            <p>Hi {user.username},</p>
            <p>Click the button below to reset your password. This link will expire in 10 minutes.</p>
            <div style="margin: 20px 0;">
                <a href="{reset_link}" style="padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Reset Password
                </a>
            </div>
            <p>If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #777;">JobConnect - Palakkad, Kerala</p>
        </body>
    </html>
    """

    # Calling the function from utils.py
    email_sent = send_brevo_email(
        subject="Reset Your JobConnect Password",
        html_content=email_body,
        to_email=email
    )

    if email_sent:
        return Response({"message": "Password reset link sent to email"}, status=status.HTTP_200_OK)
    else:
        # Check your Render logs if this triggers—it usually means the API key is missing
        return Response({"error": "Failed to send email via Brevo"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

    except Profile.DoesNotExist:
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


@csrf_exempt
def resume_checker(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    resume_text = data.get("resume", "").strip()
    if not resume_text:
        return JsonResponse({"error": "Resume text is required"}, status=400)

    prompt = f"""
You are an expert ATS (Applicant Tracking System) and career coach. Analyze the following resume and provide a comprehensive evaluation.

RESUME:
{resume_text}

Please provide your analysis in this exact structured format:

📊 RESUME SCORE: [X/100]

✅ STRENGTHS:
- [List 3-5 strong points of the resume]

❌ WEAKNESSES & MISSING KEYWORDS:
- [List specific missing skills, keywords, or sections that recruiters look for]

📝 SECTION-BY-SECTION IMPROVEMENTS:
- Summary/Objective: [Specific advice]
- Skills Section: [What to add or reformat]
- Experience Section: [How to improve bullet points - use STAR method]
- Education Section: [What to highlight]

🎯 ATS OPTIMIZATION TIPS:
- [3-5 specific tips to make the resume pass ATS filters]

🚀 OVERALL RECOMMENDATION:
[2-3 sentence summary of what the candidate should do next]
"""

    result = generate_ai_response(prompt)
    return JsonResponse({"result": result})


@csrf_exempt
def mock_interview(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    role = data.get("role", "").strip()
    if not role:
        return JsonResponse({"error": "Job role is required"}, status=400)

    prompt = f"""
You are a senior technical interviewer at a top tech company. Generate a structured mock interview for a {role} position.

Please provide the interview in this exact structured format:

🎯 MOCK INTERVIEW: {role.upper()}

━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ WARM-UP QUESTION:
Q: [An introductory behavioral question]
💡 What the interviewer looks for: [Brief hint on expected answer approach]

2️⃣ TECHNICAL QUESTION 1:
Q: [Core technical concept for this role]
💡 What the interviewer looks for: [Brief hint]

3️⃣ TECHNICAL QUESTION 2:
Q: [Problem-solving or hands-on technical question]
💡 What the interviewer looks for: [Brief hint]

4️⃣ BEHAVIORAL QUESTION (STAR Method):
Q: [Situational or behavioral question]
💡 What the interviewer looks for: [Brief hint on STAR method usage]

5️⃣ ADVANCED / SCENARIO QUESTION:
Q: [Complex real-world scenario or system design]
💡 What the interviewer looks for: [Brief hint]

━━━━━━━━━━━━━━━━━━━━━━━━

🔑 PRO TIPS FOR THIS INTERVIEW:
- [3 specific tips for succeeding in a {role} interview]
"""

    result = generate_ai_response(prompt)
    return JsonResponse({"questions": result})


@csrf_exempt
def skill_gap(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    skills = data.get("skills", "").strip()
    job = data.get("job", "").strip()

    if not skills or not job:
        return JsonResponse({"error": "Both 'skills' and 'job' fields are required"}, status=400)

    prompt = f"""
You are a senior tech career advisor. A candidate wants to transition into a {job} role. Perform a detailed skill gap analysis.

CANDIDATE'S CURRENT SKILLS: {skills}
TARGET JOB ROLE: {job}

Provide the analysis in this exact structured format:

🎯 SKILL GAP ANALYSIS: {job.upper()}

✅ SKILLS YOU ALREADY HAVE (that match this role):
- [List matching skills from the candidate's profile]

❌ CRITICAL MISSING SKILLS (Must-have for this role):
- [Skill name]: [Why it matters and how urgent it is]

⚠️ GOOD-TO-HAVE SKILLS (Bonus points):
- [Skill name]: [Brief reason]

📚 PERSONALIZED LEARNING ROADMAP:

Phase 1 – Foundation (Weeks 1-4):
- [Action item with specific resource recommendation]

Phase 2 – Core Skills (Weeks 5-10):
- [Action item with specific resource recommendation]

Phase 3 – Advanced & Projects (Weeks 11-16):
- [Action item with project idea to build portfolio]

🏆 ESTIMATED TIME TO JOB-READY: [X weeks/months]

💼 JOB APPLICATION STRATEGY:
- [2-3 tips specific to landing a {job} job]
"""

    result = generate_ai_response(prompt)
    return JsonResponse({"analysis": result})


@csrf_exempt
def resume_builder(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    details = data.get("details", "").strip()
    if not details:
        return JsonResponse({"error": "Details field is required"}, status=400)

    prompt = f"""
You are a professional resume writer with 10+ years of experience crafting resumes for top tech companies. 
Create a polished, ATS-friendly resume based on the following information.

CANDIDATE INFORMATION:
{details}

Generate a complete, professional resume in this exact structured format:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[FULL NAME]
📧 [Email] | 📞 [Phone] | 🌐 [LinkedIn/GitHub if mentioned] | 📍 [Location if mentioned]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROFESSIONAL SUMMARY
[2-3 compelling sentences that highlight the candidate's value proposition, key skills, and career goals. Make it impactful.]

━━━━━━━━━━━━━━━━━━━━━━
TECHNICAL SKILLS
━━━━━━━━━━━━━━━━━━━━━━
• Languages: [...]
• Frameworks & Libraries: [...]
• Databases: [...]
• Tools & Platforms: [...]

━━━━━━━━━━━━━━━━━━━━━━
PROFESSIONAL EXPERIENCE
━━━━━━━━━━━━━━━━━━━━━━
[If experience provided, format each role as:]
[Job Title] | [Company Name] | [Duration]
• [Achievement-oriented bullet using STAR method with metrics]
• [Achievement-oriented bullet]
• [Achievement-oriented bullet]

━━━━━━━━━━━━━━━━━━━━━━
PROJECTS
━━━━━━━━━━━━━━━━━━━━━━
[Project Name] | [Tech Stack]
• [What it does and your contribution]
• [Key features or impact]

━━━━━━━━━━━━━━━━━━━━━━
EDUCATION
━━━━━━━━━━━━━━━━━━━━━━
[Degree] | [Institution] | [Year]

━━━━━━━━━━━━━━━━━━━━━━
CERTIFICATIONS (if applicable)
━━━━━━━━━━━━━━━━━━━━━━
• [Certification name] – [Issuing body]

Note: Fill in all sections using the provided information. For any missing details, use appropriate professional placeholders.
"""

    result = generate_ai_response(prompt)
    return JsonResponse({"resume": result})


@csrf_exempt
def voice_interview(request):
    """
    Stateful voice interview endpoint.
    Accepts:
      - role: target job title (string)
      - conversation_history: list of {speaker, text} dicts representing the session so far
    Returns:
      - response: AI's next question OR final scorecard
      - is_complete: bool, True when the interview is finished
    """
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    role = data.get("role", "").strip()
    conversation_history = data.get("conversation_history", [])

    if not role:
        return JsonResponse({"error": "Job role is required"}, status=400)

    # Count how many AI questions have been asked so far
    ai_turns = [turn for turn in conversation_history if turn.get("speaker") == "ai"]
    question_number = len(ai_turns) + 1
    TOTAL_QUESTIONS = 5

    # Build the conversation context string
    history_text = ""
    for turn in conversation_history:
        speaker_label = "Interviewer" if turn["speaker"] == "ai" else "Candidate"
        history_text += f"{speaker_label}: {turn['text']}\n"

    # Final scorecard after 5 questions answered
    if question_number > TOTAL_QUESTIONS:
        prompt = f"""
You are a professional technical interviewer who just completed a mock interview for a {role} position.

Here is the full conversation that took place:
{history_text}

Now provide a detailed final performance scorecard in this format:

🏁 INTERVIEW COMPLETE — FINAL SCORECARD

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 OVERALL SCORE: [X/10]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 CATEGORY SCORES:
• Technical Knowledge:   [X/10] — [1-line comment]
• Communication Clarity: [X/10] — [1-line comment]
• Confidence & Tone:     [X/10] — [1-line comment]
• Problem Solving:       [X/10] — [1-line comment]
• Relevance of Answers:  [X/10] — [1-line comment]

✅ TOP STRENGTHS:
- [Strength 1 with specific example from the interview]
- [Strength 2]

📝 AREAS TO IMPROVE:
- [Weakness 1 with specific advice]
- [Weakness 2]

🚀 FINAL VERDICT:
[2-3 encouraging but honest sentences. Would you hire them? What should they do before the real interview?]
"""
        result = generate_ai_response(prompt)
        return JsonResponse({"response": result, "is_complete": True})

    # Generate the next interview question (with context-awareness)
    if question_number == 1:
        # First question — no history yet
        prompt = f"""
You are a senior technical interviewer conducting a real mock interview for a {role} position.

Start the interview with a warm, professional greeting and then ask Question 1 of 5.
Question 1 should be a warm-up behavioral question like "Tell me about yourself."

Keep your response concise — greeting + one clear question only. Do not number it or add extra commentary.
"""
    else:
        # Follow-up question — evaluate last answer and ask next
        last_candidate_answer = next(
            (t["text"] for t in reversed(conversation_history) if t["speaker"] == "candidate"),
            ""
        )
        prompt = f"""
You are a senior technical interviewer conducting a mock interview for a {role} position.

Here is the conversation so far:
{history_text}

The candidate just answered: "{last_candidate_answer}"

Do two things in one short response:
1. Give a brief (1-2 sentence) acknowledgment or constructive comment on their last answer.
2. Then ask Question {question_number} of {TOTAL_QUESTIONS} — make it progressively more technical than the previous ones.

Keep the total response under 100 words. Be professional and encouraging.
"""

    result = generate_ai_response(prompt)
    return JsonResponse({"response": result, "is_complete": False})

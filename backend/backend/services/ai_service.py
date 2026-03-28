import google.generativeai as genai
from django.conf import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-pro")

def generate_ai_response(prompt):
    response = model.generate_content(prompt)
    return response.text

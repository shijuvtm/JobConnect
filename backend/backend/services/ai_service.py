import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def generate_ai_response(prompt):
    """
    Generate AI response using Groq API.
    
    Args:
        prompt (str): The user prompt/message
        
    Returns:
        str: The AI-generated response or error message
    """
    try:
        # Initialize Groq client with API key from environment
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable is not set")
        
        client = Groq(api_key=api_key)
        
        # Call Groq API with supported model
        message = client.chat.completions.create(
            model="openai/gpt-oss-120b", 
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert career assistant."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        # Extract and return the response content
        return message.choices[0].message.content
    
    except ValueError as ve:
        # Handle missing environment variable
        error_msg = f"Configuration Error: {str(ve)}"
        print(f"[ERROR] {error_msg}")
        return error_msg
    
    except Exception as e:
        # Handle all other exceptions (API errors, network issues, etc.)
        error_msg = f"AI Service Error: {type(e).__name__}: {str(e)}"
        print(f"[ERROR] {error_msg}")
        return error_msg

import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from django.conf import settings
import os

def send_brevo_email(subject, html_content, to_email):
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = os.getenv('BREVO_API_KEY')

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    
    # Define the sender (Must be an authorized sender in your Brevo dashboard)
    sender = {"name": "JobConnect", "email": os.getenv("email")} 
    to = [{"email": to_email}]
    
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=to,
        html_content=html_content,
        sender=sender,
        subject=subject
    )

    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        return True
    except ApiException as e:
        print(f"Exception when calling Brevo API: {e}")
        return False

import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)
BREVO_URL = "https://api.brevo.com/v3/smtp/email"


def send_brevo_email(subject, html_content, to_email, to_name=None):
    if not settings.BREVO_API_KEY:
        logger.error("BREVO_API_KEY is not set")
        return False

    payload = {
        "sender": {
            "name": settings.BREVO_SENDER_NAME,
            "email": settings.BREVO_SENDER_EMAIL,
        },
        "to": [{"email": to_email, "name": to_name or to_email}],
        "subject": subject,
        "htmlContent": html_content,
    }
    headers = {
        "api-key": settings.BREVO_API_KEY,
        "accept": "application/json",
        "content-type": "application/json",
    }

    try:
        r = requests.post(BREVO_URL, json=payload, headers=headers, timeout=10)
        r.raise_for_status()
        return True
    except requests.RequestException as e:
        body = e.response.text if e.response is not None else ""
        logger.error("Brevo send failed: %s %s", e, body)
        return False

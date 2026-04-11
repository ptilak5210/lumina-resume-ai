import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app

def send_reset_email(to_email, token):
    """
    Sends a password reset email to the user.
    """
    email_user = current_app.config['EMAIL_USER']
    email_pass = current_app.config['EMAIL_PASS']
    frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:3000')

    if not email_user or not email_pass:
        print("Email credentials not configured. Skipping email sending.")
        print(f"Would have sent reset link to {to_email}: {frontend_url}/reset-password?token={token}")
        return True # Simulate success for development

    reset_link = f"{frontend_url}/reset-password?token={token}"

    message = MIMEMultipart("alternative")
    message["Subject"] = "Password Reset Request"
    message["From"] = email_user
    message["To"] = to_email

    text = f"""\
    Hi,

    You requested a password reset. Please click the link below to reset your password:

    {reset_link}

    This link will expire in 15 minutes.

    If you did not request a password reset, please ignore this email.
    """

    html = f"""\
    <html>
      <body>
        <p>Hi,</p>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <p><a href="{reset_link}">Reset Password</a></p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      </body>
    </html>
    """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    message.attach(part1)
    message.attach(part2)

    context = ssl.create_default_context()
    
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(email_user, email_pass)
            server.sendmail(email_user, to_email, message.as_string())
        print(f"Reset email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

import requests
import uuid

BASE_URL = "http://localhost:8000/api/v1"
TIMEOUT = 30

def post_reset_password_with_valid_token():
    # Step 1: Register a new user to have a known valid email
    register_url = f"{BASE_URL}/auth/register"
    unique_suffix = str(uuid.uuid4())[:8]
    user_data = {
        "full_name": "Test User Reset",
        "username": f"testreset{unique_suffix}",
        "email": f"testreset{unique_suffix}@example.com",
        "password": "OriginalPass123!",
        "password_confirmation": "OriginalPass123!"
    }
    try:
        reg_resp = requests.post(register_url, json=user_data, timeout=TIMEOUT)
        assert reg_resp.status_code == 201, f"User registration failed: {reg_resp.text}"
        reg_json = reg_resp.json()
        assert reg_json.get("success") is True
        token = reg_json["data"]["token"]
        email = user_data["email"]

        # Step 2: Request password reset token using forgot-password endpoint
        forgot_url = f"{BASE_URL}/auth/forgot-password"
        forgot_resp = requests.post(forgot_url, json={"email": email}, timeout=TIMEOUT)
        assert forgot_resp.status_code == 200, f"Forgot password failed: {forgot_resp.text}"
        forgot_json = forgot_resp.json()
        assert forgot_json.get("success") is True
        reset_token = forgot_json["data"]["reset_token"]
        assert isinstance(reset_token, str) and len(reset_token) > 0

        # Step 3: Use reset token to reset password (POST /auth/reset-password)
        reset_url = f"{BASE_URL}/auth/reset-password"
        new_password = "NewPass1234!"
        reset_payload = {
            "email": email,
            "token": reset_token,
            "password": new_password,
            "password_confirmation": new_password
        }
        reset_resp = requests.post(reset_url, json=reset_payload, timeout=TIMEOUT)
        assert reset_resp.status_code == 200, f"Reset password failed: {reset_resp.text}"
        reset_json = reset_resp.json()
        assert reset_json.get("success") is True
        assert "password reset" in reset_json.get("message", "").lower()

        # Step 4: Verify login with new password returns 200 and token
        login_url = f"{BASE_URL}/auth/login"
        login_payload = {
            "username": user_data["username"],
            "password": new_password
        }
        login_resp = requests.post(login_url, json=login_payload, timeout=TIMEOUT)
        assert login_resp.status_code == 200, f"Login with new password failed: {login_resp.text}"
        login_json = login_resp.json()
        assert login_json.get("success") is True
        assert "token" in login_json.get("data", {})

    finally:
        # Cleanup: Delete the registered user using the original token (if possible)
        # There is no explicit delete user endpoint in provided PRD, so skipping cleanup.
        pass

post_reset_password_with_valid_token()
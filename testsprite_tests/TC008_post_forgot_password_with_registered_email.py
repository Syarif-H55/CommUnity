import requests
import uuid

BASE_URL = "http://localhost:8000/api/v1"
REGISTER_ENDPOINT = f"{BASE_URL}/auth/register"
FORGOT_PASSWORD_ENDPOINT = f"{BASE_URL}/auth/forgot-password"

def test_post_forgot_password_with_registered_email():
    # Create unique user data for registration
    unique_suffix = str(uuid.uuid4()).replace("-", "")[:8]
    user_data = {
        "full_name": "Test User",
        "username": f"testuser_{unique_suffix}",
        "email": f"testuser_{unique_suffix}@example.com",
        "password": "Password123!",
        "password_confirmation": "Password123!"
    }

    try:
        # Register a new user to ensure email is registered
        register_response = requests.post(
            REGISTER_ENDPOINT,
            json=user_data,
            timeout=30
        )
        assert register_response.status_code == 201, f"Registration failed: {register_response.text}"
        register_json = register_response.json()
        assert register_json.get("success") is True, "Registration success flag false"
        assert "data" in register_json and "user" in register_json["data"], "User data missing in registration response"

        # Use the registered email to request forgot password reset token
        forgot_password_payload = {"email": user_data["email"]}
        forgot_response = requests.post(
            FORGOT_PASSWORD_ENDPOINT,
            json=forgot_password_payload,
            timeout=30
        )
        assert forgot_response.status_code == 200, f"Forgot password request failed: {forgot_response.text}"
        forgot_json = forgot_response.json()
        assert forgot_json.get("success") is True, "Forgot password success flag false"
        data = forgot_json.get("data", {})
        assert isinstance(data, dict), "Forgot password data field missing or not a dict"
        assert "reset_token" in data and isinstance(data["reset_token"], str) and data["reset_token"], "Reset token missing or invalid"
        assert "message" in forgot_json and isinstance(forgot_json["message"], str) and forgot_json["message"], "Message missing or invalid"

    finally:
        # Cleanup is not required as user persistence is not assumed to be permanent or no explicit delete endpoint provided for users
        pass

test_post_forgot_password_with_registered_email()
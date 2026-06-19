import requests
import uuid

BASE_URL = "http://localhost:8000/api/v1"
REGISTER_ENDPOINT = f"{BASE_URL}/auth/register"
LOGIN_ENDPOINT = f"{BASE_URL}/auth/login"
TIMEOUT = 30


def test_post_user_login_with_valid_credentials():
    # Create a new user first to ensure valid credentials exist
    unique_suffix = str(uuid.uuid4())[:8]
    user_data = {
        "full_name": f"Test User {unique_suffix}",
        "username": f"testuser_{unique_suffix}",
        "email": f"testuser_{unique_suffix}@example.com",
        "password": "TestPassword123!",
        "password_confirmation": "TestPassword123!"
    }

    # Register user
    try:
        register_resp = requests.post(
            REGISTER_ENDPOINT,
            json=user_data,
            timeout=TIMEOUT
        )
        assert register_resp.status_code == 201, f"Failed to register user: {register_resp.text}"
        register_json = register_resp.json()
        assert register_json.get("success") is True
        token = register_json.get("data", {}).get("token")
        user = register_json.get("data", {}).get("user")
        assert token is not None, "Token missing in registration response"
        assert user is not None, "User data missing in registration response"

        # Use the registered username and password to login
        login_payload = {
            "username": user_data["username"],
            "password": user_data["password"]
        }
        login_resp = requests.post(LOGIN_ENDPOINT, json=login_payload, timeout=TIMEOUT)
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
        login_json = login_resp.json()
        assert login_json.get("success") is True
        login_user = login_json.get("data", {}).get("user")
        login_token = login_json.get("data", {}).get("token")
        assert login_user is not None, "User data missing in login response"
        assert login_token is not None, "Token missing in login response"
        # Optional: verify that username in login response matches
        assert login_user.get("username") == user_data["username"]
        assert isinstance(login_token, str) and len(login_token) > 0

    finally:
        # Cleanup: If an API endpoint for deleting users existed, it would be called here.
        # The provided PRD does not mention user deletion, so cleanup is skipped.
        pass


test_post_user_login_with_valid_credentials()
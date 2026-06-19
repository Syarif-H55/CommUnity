import requests
import uuid

BASE_URL = "http://localhost:8000/api/v1"
TIMEOUT = 30

def post_user_logout_with_valid_token():
    register_url = f"{BASE_URL}/auth/register"
    login_url = f"{BASE_URL}/auth/login"
    logout_url = f"{BASE_URL}/auth/logout"
    profile_url = f"{BASE_URL}/profile"

    # Generate unique user data to avoid duplicates
    unique_suffix = str(uuid.uuid4())[:8]
    user_data = {
        "full_name": f"Test User {unique_suffix}",
        "username": f"testuser_{unique_suffix}",
        "email": f"testuser_{unique_suffix}@example.com",
        "password": "Password123!",
        "password_confirmation": "Password123!"
    }

    token = None

    # Register the user
    try:
        resp_register = requests.post(register_url, json=user_data, timeout=TIMEOUT)
        assert resp_register.status_code == 201, f"Expected 201 on registration, got {resp_register.status_code}"
        json_register = resp_register.json()
        assert json_register.get("success") is True
        assert "token" in json_register.get("data", {})
        token = json_register["data"]["token"]
        assert token and isinstance(token, str)

        # Logout with valid token
        headers = {"Authorization": f"Bearer {token}"}
        resp_logout = requests.post(logout_url, headers=headers, timeout=TIMEOUT)
        assert resp_logout.status_code == 200, f"Expected 200 on logout, got {resp_logout.status_code}"
        json_logout = resp_logout.json()
        assert json_logout.get("success") is True
        assert isinstance(json_logout.get("message"), str)

        # Subsequent access with the same token should be unauthorized
        resp_profile = requests.get(profile_url, headers=headers, timeout=TIMEOUT)
        assert resp_profile.status_code == 401, f"Expected 401 on accessing profile with logged out token, got {resp_profile.status_code}"

    finally:
        # Cleanup: no endpoint to delete user provided, so no deletion possible.
        # If there were a delete user endpoint, it should be called here with a fresh token or admin privileges.
        pass

post_user_logout_with_valid_token()
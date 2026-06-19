import requests
import uuid

BASE_URL = "http://localhost:8000/api/v1"
REGISTER_ENDPOINT = f"{BASE_URL}/auth/register"
TIMEOUT = 30

def post_user_registration_with_valid_data():
    # Generate unique user data to avoid duplication conflicts
    unique_str = str(uuid.uuid4()).replace('-', '')[:8]
    full_name = f"Test User {unique_str}"
    username = f"testuser{unique_str}"
    email = f"testuser{unique_str}@example.com"
    password = "StrongPass!1"
    payload = {
        "full_name": full_name,
        "username": username,
        "email": email,
        "password": password,
        "password_confirmation": password
    }
    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(REGISTER_ENDPOINT, json=payload, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to register user failed: {e}"

    assert response.status_code == 201, f"Expected status code 201, got {response.status_code}"

    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert data.get("success") is True, "Response 'success' field is not True"
    assert "data" in data, "'data' field missing in response"
    user_data = data["data"].get("user")
    token = data["data"].get("token")
    message = data.get("message")

    assert user_data is not None, "'user' data missing in response"
    assert token is not None and isinstance(token, str) and len(token) > 0, "Token missing or invalid in response"
    assert isinstance(message, str) and len(message) > 0, "'message' missing or invalid in response"

    # Verify returned user data matches input where applicable
    assert user_data.get("full_name") == full_name, "Returned full_name does not match input"
    assert user_data.get("username") == username, "Returned username does not match input"
    assert user_data.get("email") == email, "Returned email does not match input"

post_user_registration_with_valid_data()
import requests

BASE_URL = "http://localhost:8000/api/v1"
LOGIN_ENDPOINT = f"{BASE_URL}/auth/login"
TIMEOUT = 30

def post_user_login_with_invalid_credentials():
    url = LOGIN_ENDPOINT
    headers = {
        "Content-Type": "application/json"
    }
    # Using clearly invalid credentials
    payload = {
        "username": "nonexistentuser12345",
        "password": "WrongPassword!@#"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    # Expecting 422 Unprocessable Entity
    assert response.status_code == 422, f"Expected status code 422, got {response.status_code}"

    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # According to PRD, 422 response for invalid credentials with no token
    # Checking that 'success' is False or not True and no token in data
    token_present = "token" in data.get("data", {}) if isinstance(data.get("data"), dict) else False

    assert not token_present, "Token should not be present in response for invalid credentials"

post_user_login_with_invalid_credentials()
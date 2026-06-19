import requests

BASE_URL = "http://localhost:8000/api/v1"
TIMEOUT = 30


def test_post_user_registration_with_invalid_data():
    url = f"{BASE_URL}/auth/register"
    headers = {
        "Content-Type": "application/json"
    }
    # List of invalid payloads to test various validation errors
    invalid_payloads = [
        {},  # completely empty body
        {"full_name": "", "username": "", "email": "", "password": "", "password_confirmation": ""},
        {"full_name": "Test User"},  # missing required fields username, email, password, password_confirmation
        {"username": "testuser"},  # missing others
        {"email": "not-an-email", "password": "123", "password_confirmation": "123"},
        {"full_name": "Test User", "username": "tu", "email": "email@example.com", "password": "123", "password_confirmation": "1234"},  # password mismatch
        {"full_name": "A"*256, "username": "user", "email": "email@example.com", "password": "password", "password_confirmation": "password"},  # too long full_name
        {"full_name": "Test User", "username": "user", "email": "plainaddress", "password": "password", "password_confirmation": "password"},
    ]

    for payload in invalid_payloads:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
        assert response.status_code == 422, f"Expected status 422 for payload {payload}, got {response.status_code}"
        try:
            resp_json = response.json()
        except Exception:
            assert False, f"Response is not valid JSON: {response.text}"
        # Validate presence of validation errors in response body
        assert isinstance(resp_json, dict), "Response JSON should be a dictionary"
        # According to Laravel's typical validation response structure:
        # Check that resp_json contains 'errors' or similar keys indicating validation problem
        # We allow either 'errors' or top-level keys for field errors
        has_errors = False
        if "errors" in resp_json and isinstance(resp_json["errors"], dict) and len(resp_json["errors"]) > 0:
            has_errors = True
            for field, messages in resp_json["errors"].items():
                assert isinstance(messages, list) and len(messages) > 0, f"Error messages for {field} should be a non-empty list"
        else:
            # Sometimes validation errors may appear as keys with string or list messages
            for key, value in resp_json.items():
                if isinstance(value, list) and all(isinstance(i, str) for i in value):
                    has_errors = True
                    break
        assert has_errors, f"No validation error messages found in response for payload {payload}"


test_post_user_registration_with_invalid_data()

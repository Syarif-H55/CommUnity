import requests

BASE_URL = "http://localhost:8000/api/v1"
TIMEOUT = 30

def test_post_forgot_password_with_unregistered_email():
    url = f"{BASE_URL}/auth/forgot-password"
    # Use an obviously unregistered or invalid email for testing
    payload = {
        "email": "unregistered_email_for_testing_12345@example.com"
    }
    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 422 or response.status_code >= 400, \
        f"Expected 422 or error status code, got {response.status_code}"

    # Try to parse response and check for validation error info
    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Expect a 422 validation error response payload or error message presence
    if response.status_code == 422:
        # Commonly validation errors use 'errors' key or similar for details
        assert "errors" in data or ("message" in data and data.get("message")), \
            "Validation error response missing error details"
    else:
        # For other error status codes, at least a message key expected
        assert "message" in data, "Error response missing message field"


test_post_forgot_password_with_unregistered_email()
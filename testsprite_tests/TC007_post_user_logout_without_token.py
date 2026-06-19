import requests

BASE_URL = "http://localhost:8000/api/v1"
TIMEOUT = 30

def test_post_user_logout_without_token():
    url = f"{BASE_URL}/auth/logout"
    headers = {}  # No Authorization header

    response = requests.post(url, headers=headers, timeout=TIMEOUT)
    assert response.status_code == 401, f"Expected 401 but got {response.status_code} without token"

    # Test with an expired token (simulate by using an invalid token)
    expired_token = "Bearer expired.token.value"
    headers_expired = {"Authorization": expired_token}

    response_expired = requests.post(url, headers=headers_expired, timeout=TIMEOUT)
    assert response_expired.status_code == 401, f"Expected 401 but got {response_expired.status_code} with expired token"

test_post_user_logout_without_token()
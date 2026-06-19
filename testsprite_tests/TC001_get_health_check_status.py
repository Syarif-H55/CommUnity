import requests

BASE_URL = "http://localhost:8000/api/v1"
TIMEOUT = 30

def test_get_health_check_status():
    url = f"{BASE_URL}/health"
    try:
        response = requests.get(url, timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
        json_response = response.json()
        assert "success" in json_response, "'success' key not in response"
        assert json_response["success"] is True, "'success' is not True"
        assert "message" in json_response, "'message' key not in response"
        assert isinstance(json_response["message"], str) and len(json_response["message"]) > 0, "'message' is not a non-empty string"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_get_health_check_status()
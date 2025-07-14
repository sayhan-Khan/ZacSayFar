import requests


# Test 1: Check if the /foods endpoint returns status code 200
def test_get_foods_status_code():
    response = requests.get("http://127.0.0.1:5000/foods")
    assert response.status_code == 200


# Test 2: Check if the /foods endpoint returns JSON list of directiories
def test_get_foods_response_format():
    response = requests.get("http://127.0.0.1:5000/foods")
    data = response.json()
    assert isinstance(data, list)
    assert isinstance(data[0], dict)
    assert "id" in data[0]
    assert "name" in data[0]
    assert "calories" in data[0]
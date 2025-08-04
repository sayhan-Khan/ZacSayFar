import requests
# Test 1: Check if the /foods endpoint returns status code 200
def test_get_foods_status_code():
    response = requests.get("http://127.0.0.1:5000/api/foods")
    assert response.status_code == 200
# Test 2: Check if the /foods endpoint returns JSON list of directiories
def test_get_foods_response_format():
    response = requests.get("http://127.0.0.1:5000/api/foods")
    data = response.json()
    assert isinstance(data, list)
    assert isinstance(data[0], dict)
    assert "id" in data[0]
    assert "name" in data[0]
    assert "calories" in data[0]
# Test 3: Check if /api/register works for a new user
def test_register_new_user():
    payload = {
        "firstName": "Test",
        "lastName": "User",
        "email": "testuser@example.com",
        "password": "password123"
    }
    response = requests.post("http://127.0.0.1:5000/api/register", json=payload)
    assert response.status_code == 201 or response.status_code == 409 
# Test 4: Check if /api/login works with correct credentials
def test_login_user():
    payload = {
        "email": "testuser@example.com",
        "password": "password123"
    }
    response = requests.post("http://127.0.0.1:5000/api/login", json=payload)
    data = response.json()
    assert response.status_code == 200
    assert "message" in data and data["message"] == "Login successful"
# Test 5: Check if /api/add-meal adds a meal to user storage
def test_add_meal_to_user():
    payload = {
        "email": "testuser@example.com",
        "foodName": "Bananas",  #  bananas should exist
        "quantity": 1
    }
    response = requests.post("http://127.0.0.1:5000/api/add-meal", json=payload)
    data = response.json()
    assert response.status_code == 201 or response.status_code == 404  # 404 if food/user not found
    if response.status_code == 201:
        assert "message" in data and data["message"] == "Meal added successfully"
    else:
        assert "error" in data  # 404 case
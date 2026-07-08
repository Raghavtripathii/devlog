def test_register_success(client):
    response = client.post("/auth/register", json={
        "username": "raghav",
        "email": "raghav@example.com",
        "password": "secure123",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "raghav"
    assert data["email"] == "raghav@example.com"
    assert "hashed_password" not in data  # never expose the hash


def test_register_duplicate_email(client, registered_user):
    response = client.post("/auth/register", json={
        "username": "another",
        "email": "test@example.com",  # same email as registered_user
        "password": "password123",
    })
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]


def test_login_success(client, registered_user):
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "password123",
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client, registered_user):
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "wrongpassword",
    })
    assert response.status_code == 401


def test_protected_endpoint_without_token(client):
    response = client.get("/sessions/")
    assert response.status_code == 401
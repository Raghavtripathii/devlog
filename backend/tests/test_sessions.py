from datetime import datetime


def test_create_session(client, auth_headers):
    response = client.post("/sessions/", json={
        "language": "Python",
        "hours": 3,
        "what_i_built": "Built the FastAPI auth system for DevLog",
        "mood": 4,
    }, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["language"] == "Python"
    assert data["hours"] == 3


def test_list_sessions(client, auth_headers):
    # Log two sessions
    client.post("/sessions/", json={
        "language": "TypeScript", "hours": 2, "what_i_built": "Built the frontend", "mood": 5
    }, headers=auth_headers)
    client.post("/sessions/", json={
        "language": "Python", "hours": 4, "what_i_built": "Fixed auth bugs", "mood": 3
    }, headers=auth_headers)

    response = client.get("/sessions/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_sessions_are_private(client, registered_user, auth_headers):
    """Make sure one user can't see another user's sessions."""
    client.post("/sessions/", json={
        "language": "Python", "hours": 1, "what_i_built": "Secret project", "mood": 5
    }, headers=auth_headers)

    # Register and login as a different user
    client.post("/auth/register", json={
        "username": "otheruser", "email": "other@example.com", "password": "pass123"
    })
    login_res = client.post("/auth/login", json={
        "email": "other@example.com", "password": "pass123"
    })
    other_headers = {"Authorization": f"Bearer {login_res.json()['access_token']}"}

    response = client.get("/sessions/", headers=other_headers)
    assert response.status_code == 200
    assert len(response.json()) == 0  # other user should see zero sessions


def test_invalid_mood_rejected(client, auth_headers):
    response = client.post("/sessions/", json={
        "language": "Python", "hours": 3, "what_i_built": "Something", "mood": 10
    }, headers=auth_headers)
    assert response.status_code == 422  # Pydantic validation error
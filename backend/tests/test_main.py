from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# API test
def test_read_root():
    response = client.get("/")
    assert response.status_code == 404

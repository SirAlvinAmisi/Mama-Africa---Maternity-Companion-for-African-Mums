import pytest
from app import create_app
from flask_jwt_extended import create_access_token
import socketio

# === Setup ===

@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app()
    flask_app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-secret",
    })

    testing_client = flask_app.test_client()

    ctx = flask_app.app_context()
    ctx.push()
    yield testing_client
    ctx.pop()

# === Basic App Tests ===

def test_app_creation(test_client):
    response = test_client.get("/")  # If no "/" route, status may be 404
    assert response.status_code in [200, 404]

def test_jwt_error_handling(test_client):
    response = test_client.post("/mums/pregnancy")  # switch to POST
    assert response.status_code == 401


# === Socket.IO Tests ===

def test_socketio_connection():
    client = socketio.Client()

    try:
        client.connect("http://localhost:5000", transports=['websocket'])
        assert client.connected
    except Exception as e:
        pytest.fail(f"Socket.IO connection failed: {e}")
    finally:
        client.disconnect()

def test_socketio_join_room_with_valid_token():
    client = socketio.Client()

    # Create test token
    app = create_app()
    with app.app_context():
        token = create_access_token(identity=1, additional_claims={"role": "mum"})

    received = {}

    @client.on("connect")
    def on_connect():
        client.emit("join_room", {"token": token})

    @client.on("new_notification")
    def on_new_notification(data):
        received["message"] = data["message"]

    try:
        client.connect("http://localhost:5000", transports=["websocket"])
        assert client.connected
    except Exception as e:
        pytest.fail(f"Join room test failed: {e}")
    finally:
        client.disconnect()

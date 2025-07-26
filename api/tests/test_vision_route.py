import base64
import pytest
from unittest.mock import patch
from unittest.mock import MagicMock



def mock_vision_image_client():
    # GENAI Citation
    # https://chatgpt.com/share/6885377c-e934-8012-96b5-2a6d7993647f
    mock_label_1 = MagicMock()
    mock_label_1.description = "fruits"
    mock_label_1.score = 0.98
    mock_label_2 = MagicMock()
    mock_label_2.description = "Apple"
    mock_label_2.score = 0.98

    mock_response = MagicMock()
    mock_response.label_annotations = [mock_label_1, mock_label_2]

    mock_client = MagicMock()
    mock_client.label_detection.return_value = mock_response

    return mock_client

def mock_vision_label_client():
    mock_label_1 = MagicMock()
    mock_label_1.description = "fruits"
    mock_label_1.score = 0.98
    mock_label_2 = MagicMock()
    mock_label_2.description = "Apple"
    mock_label_2.score = 0.98

    mock_response = MagicMock()
    mock_response.label_annotations = [mock_label_1, mock_label_2]

    mock_client = MagicMock()
    mock_client.label_detection.return_value = mock_response

    return mock_client


@pytest.fixture
def base_64_apple():
    """Fixture that returns a base64 encoded string of an image of an apple"""
    with open("./api/tests/assets/apple.jpg", "rb") as image_file:
        image_data = image_file.read()
        base64_string = base64.b64encode(image_data).decode('utf-8')
    return base64_string

@pytest.fixture
def base_64_poptart():
    """Fixture that returns a base64 encoded string of an image of a poptart"""
    with open("./api/tests/assets/poptart.png", "rb") as image_file:
        image_data = image_file.read()
        base64_string = base64.b64encode(image_data).decode('utf-8')
    return base64_string
    



def test_vision_no_mode(client, auth_headers, base_64_apple):
    """When no mode is provided, POST /api/vision/analyze gives a 400 error code"""
    req_json = {"image": base_64_apple}
    response = client.post('/api/vision/analyze', json=req_json, headers=auth_headers)
    assert response.status_code == 400
    assert response.get_json()['msg'] == 'invalid mode'

def test_vision_invalid_mode(client, auth_headers, base_64_apple):
    """When an invalid mode is provided, POST /api/vision/analyze gives a 400 error code"""
    req_json = {"image": base_64_apple, "mode": "foo"}
    response = client.post('/api/vision/analyze', json=req_json, headers=auth_headers)
    assert response.status_code == 400
    assert response.get_json()['msg'] == 'invalid mode'

def test_vision_invalid_image(client, auth_headers):
    """When an invalid mode is provided, POST /api/vision/analyze gives a 400 error code"""
    req_json = {"image": "not an image", "mode": "image"}
    response = client.post('/api/vision/analyze', json=req_json, headers=auth_headers)
    assert response.status_code == 400
    assert response.get_json()['msg'] == 'invalid image'

def test_vision_valid_image(client, auth_headers, base_64_apple, populate_db):
    """When a valid image is provided, the associated ingredient is returned"""
    req_json = {"image": base_64_apple, "mode": "image"}
    # mock the vision client in the api route
    with patch("app.routes.vision.get_vision_client", new=mock_vision_image_client):
        response = client.post('/api/vision/analyze', json=req_json, headers=auth_headers)
        assert response.get_json()['ingredient'] == 'apple'


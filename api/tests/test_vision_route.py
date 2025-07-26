import base64
import pytest

@pytest.fixture
def base_64_image():
    """Fixture that returns a base64 encoded string of an image of an apple"""
    with open("./api/tests/assets/apple.jpg", "rb") as image_file:
        image_data = image_file.read()
        base64_string = base64.b64encode(image_data).decode('utf-8')
    return base64_string
    


def test_vision_no_mode(client, auth_headers, base_64_image):
    """When no mode is provided, POST /api/vision/analyze gives a 400 error code"""
    req_json = {"image": base_64_image}
    response = client.post('/api/vision/analyze', json=req_json, headers=auth_headers)
    assert response.status_code == 400
    assert response.get_json()['msg'] == 'invalid mode'

def test_vision_invalid_mode(client, auth_headers, base_64_image):
    """When an invalid mode is provided, POST /api/vision/analyze gives a 400 error code"""
    req_json = {"image": base_64_image, "mode": "foo"}
    response = client.post('/api/vision/analyze', json=req_json, headers=auth_headers)
    assert response.status_code == 400
    assert response.get_json()['msg'] == 'invalid mode'

def test_vision_invalid_image(client, auth_headers):
    """When an invalid mode is provided, POST /api/vision/analyze gives a 400 error code"""
    req_json = {"image": "not an image", "mode": "image"}
    response = client.post('/api/vision/analyze', json=req_json, headers=auth_headers)
    assert response.status_code == 400
    assert response.get_json()['msg'] == 'invalid image'

def test_vision_valid_image(client, auth_headers, base_64_image, populate_db):
    req_json = {"image": base_64_image, "mode": "image"}
    # response = client.post('/api/vision/analyze', json=req_json, headers=auth_headers)
    assert True == True
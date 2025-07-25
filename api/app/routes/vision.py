from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import base64
from google.cloud import vision
from PIL import Image
import io

vision_bp = Blueprint('vision', __name__, url_prefix="/api/vision")

client = vision.ImageAnnotatorClient()

def isValidImage(image_str):
    """isValidImage returns True if an image is a valid b64 encoded string, or false otherwise."""
    try:
        image_bytes = base64.b64decode(image_str)
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()
        return True
    except Exception:
        return False

    
@jwt_required()
@vision_bp.route('/analyze', methods=['POST'])
def get_image_details():
    """Returns the image details of a provided base64 image of a product/ingredient"""
    req_json = request.get_json()
    # only valid modes supported
    # pantry => picture of multiple products
    # label => picture of a product label
    possible_modes = ("label", "image", "pantry")
    mode = req_json.get('mode')
    #base 64 encoded image
    image = req_json.get('image')
    if image is None or not isValidImage(image):
        return jsonify({
            "msg": "invalid image"
        }), 400

    if not mode in possible_modes:
        return jsonify({
            "msg" : "invalid mode"
        }), 400
    image_bytes = base64.b64decode(image)
    
    if mode == "image":
        vision_image = vision.Image(content = image_bytes)
        response = client.label_detection(image = vision_image)
        labels = [
            {"description": label.description, "score": label.score}
            for label in response.label_annotations
        ]

        return jsonify({"labels": labels}), 200

    return jsonify({"msg": "todo"}), 200
        
        





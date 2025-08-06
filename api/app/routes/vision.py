from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import base64
from google.cloud import vision
from PIL import Image
import io
from app.models.ingredient import Ingredient
import sqlalchemy as sa
from app import db

vision_bp = Blueprint('vision', __name__, url_prefix="/api/vision")

def get_vision_client():
    # need to lazy load client to prevent auth errors 
    # when env variable is not defined
    return vision.ImageAnnotatorClient()

def isValidImage(image_str):
    """isValidImage returns True if an image is a valid b64 encoded string, or false otherwise."""
    try:
        image_bytes = base64.b64decode(image_str)
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()
        return True
    except Exception:
        return False


def get_matching_ingredient(candidates):
    """
    Given a sorted list of ingredient candidates, 
    get_matching ingredient returns the top candidate in the db, 
    or None if none are in the db
    """
    stmt = sa.select(Ingredient.name).filter(Ingredient.name.in_(candidates))
    result_set = set(db.session.scalars(stmt).all())
    for candidate in candidates:
        # return first candidate that is in our db
        if candidate.lower() in result_set:
            return candidate.lower()
    

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
    
    try:
        client = get_vision_client()
        vision_image = vision.Image(content = image_bytes)

        if mode == "image":
            response = client.label_detection(image = vision_image)
            if hasattr(response, "label_annotations"):
                candidates = [label.description.lower() for label in response.label_annotations]
                ingredient = get_matching_ingredient(candidates)
                return jsonify({"ingredient": ingredient})
            raise Exception('unexpected google api response')
        elif mode == "pantry":
            # likely use object_localization()
            return jsonify({"msg": "Not Implemented"}), 400
        else:
            # likely use document_text_detection
            return jsonify({"msg": "Not Implemented"}), 400



    except Exception:
        print('exception occured')
        #handle all google api errors
        return jsonify({"ingredient": None})



    
        
        





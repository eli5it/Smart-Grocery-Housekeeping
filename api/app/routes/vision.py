from datetime import date
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import sqlalchemy as sa
from app import db
from app.models.ingredient import Ingredient
from app.models.pantry_entry import PantryEntry, PantryStatus
from app.schemas import PantryEntrySchema
import json
from pydantic import BaseModel, ValidationError
from typing import List, Optional
import base64
from google.cloud import vision
from PIL import Image

vision_bp = Blueprint('vision', __name__, url_prefix="/api/vision")

client = vision.ImageAnnotatorClient()

def isValidImage(image_str):
    """isValidImage returns True if an image is a valid b64 encoded string, or false otherwise."""
    try:
        valid_encoding = base64.b64encode(base64.b64decode(image_str)) == image_str
        if valid_encoding:
            img = Image.open(image_str)
            img.verify(image_str)
            return True
        return False
    except Exception:
        return False

@vision_bp.route('/analyze', methods=['POST'])
def get_image_details():
    """Returns the image details of a provided base64 image of a product/ingredient"""

    # only valid modes supported
    # pantry => picture of multiple products
    # label => picture of a product label
    possible_modes = ("label", "image", "pantry")
    mode = request.args.get('mode')
    #base 64 encoded image
    image = request.args.get('image')

    if image is None or not isValidImage(image):
        return jsonify({
            "msg": "Invalid image"
        }), 400

    if not mode in possible_modes:
        return jsonify({
            "msg" : "Invalid mode"
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
        
        




    return jsonify({"hello" : "world"}), 200
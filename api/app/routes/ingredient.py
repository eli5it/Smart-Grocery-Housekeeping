from flask import Blueprint, jsonify
ingredient_bp = Blueprint('ingredient', __name__, url_prefix='/api/ingredients')

@ingredient_bp.route('/')
def get_ingredients():
    return jsonify(['apple', 'banana', 'carrot'])

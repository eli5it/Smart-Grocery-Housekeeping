from flask import Blueprint, jsonify
item_bp = Blueprint('item', __name__, url_prefix='/api/items')

@item_bp.route('/')
def get_items():
    return jsonify(['apple', 'banana', 'carrot'])

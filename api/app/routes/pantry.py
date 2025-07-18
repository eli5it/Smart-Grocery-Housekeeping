from datetime import date
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import sqlalchemy as sa
from app import db
from app.models.ingredient import Ingredient
from app.models.pantry_entry import PantryEntry, PantryStatus
from app.schemas import PantryEntrySchema


pantry_bp = Blueprint('pantry', __name__)
pantry_entry_schema = PantryEntrySchema(many=True)


@pantry_bp.route('/pantry', methods=['GET'])
@jwt_required()
def get_pantry():
    user_id = get_jwt_identity()
    pantry_items = PantryEntry.query.filter_by(
        user_id=user_id,
        status=PantryStatus.IN_STOCK).all()

    return jsonify(pantry_entry_schema.dump(pantry_items)), 200


@pantry_bp.route('/pantry', methods=['POST'])
@jwt_required()
def add_pantry_entry():
    user_id = get_jwt_identity()
    data = request.get_json()

    ingredient_id = data.get('ingredient_id')
    ingredient_name = data.get('name')
    expiration_date = data.get('expiration_date')

    if not ingredient_name:
        return jsonify({"msg": "Ingredient Name is required"}), 400

    ingredient = Ingredient.query.filter(
        sa.func.lower(Ingredient.id) == ingredient_id
    ).first()
    if not ingredient:
        ingredient = Ingredient(name=ingredient_name)
        db.session.add(ingredient)
        db.session.flush()

    entry = PantryEntry(
        ingredient_id=ingredient.id,
        user_id=user_id,
        expiration_date=(
            date.fromisoformat(expiration_date)
            if expiration_date else None
        )
    )

    db.session.add(entry)
    db.session.commit()

    return jsonify({"msg": "Pantry entry added successfully"}), 201

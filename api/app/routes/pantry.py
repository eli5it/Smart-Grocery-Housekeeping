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

pantry_bp = Blueprint('pantry', __name__)
pantry_entry_schema = PantryEntrySchema()
pantry_entries_schema = PantryEntrySchema(many=True)




@pantry_bp.route('/pantry', methods=['GET'])
@jwt_required()
def get_pantry():
    user_id = get_jwt_identity()
    pantry_items = PantryEntry.query.filter_by(
        user_id=user_id,
        status=PantryStatus.IN_STOCK).all()

    return jsonify(pantry_entries_schema.dump(pantry_items)), 200



class NewPantryEntry(BaseModel):
    name: str
    product_name: Optional[str] = None
    expiration_date: Optional[str] = None

# defines the shape of json expected from frontend
class Payload(BaseModel):
    pantry_entries: List[NewPantryEntry]

@pantry_bp.route('/pantry', methods=['POST'])
@jwt_required()
def add_pantry_entry():
    user_id = get_jwt_identity()

    try:
        # validate payload
        payload = Payload(**request.get_json())
       
        
    except ValidationError as e:
        return jsonify({
            'message' : "Invalid payload", 'error': e.errors()
        }), 400
    
    ingredient_names = list(map (lambda entry: entry.name, payload.pantry_entries))
    query = sa.select(Ingredient).filter(Ingredient.name.in_(ingredient_names) )
    existing_ingredients = db.session.scalars(query).all()
    ingredient_map = {}

    for ingredient in existing_ingredients:
        ingredient_map[ingredient.name] = ingredient


    for pantry_entry in payload.pantry_entries:
        ingredient_name = pantry_entry.name
        if not ingredient_name in ingredient_map:
            new_ingredient = Ingredient(name = ingredient_name)
            ingredient_map[new_ingredient.name] = new_ingredient
            db.session.add(new_ingredient)
    


    # make ingredient primary keys available
    db.session.flush()

    for pantry_entry in payload.pantry_entries:
        ingredient_name = pantry_entry.name
        expiration_date = pantry_entry.expiration_date
        new_entry = PantryEntry(
            ingredient_id= ingredient_map[ingredient_name].id,
            user_id=user_id,
            expiration_date=(
                date.fromisoformat(expiration_date)
                if expiration_date else None
        ))
        db.session.add(new_entry)
    
    db.session.commit()

    return jsonify({"msg": "Pantry entries added successfully"}), 201
    
       


@pantry_bp.route('/pantry/<int:entry_id>', methods=['DELETE'])
@jwt_required()
def delete_pantry_entry(entry_id):
    user_id = get_jwt_identity()
    entry = PantryEntry.query.filter_by(id=entry_id, user_id=user_id).first()

    if not entry:
        return jsonify({"msg": "Pantry entry not found"}), 404

    db.session.delete(entry)
    db.session.commit()

    return jsonify({"msg": "Pantry entry deleted successfully"}), 200


@pantry_bp.route('/pantry/<int:entry_id>', methods=['PATCH'])
@jwt_required()
def update_pantry_entry(entry_id):
    user_id = get_jwt_identity()
    pantry_entry = PantryEntry.query.filter_by(
        id=entry_id, user_id=user_id
    ).first()
    data = request.get_json()

    if 'status' in data:
        try:
            pantry_entry.status = PantryStatus(data['status'])
        except ValueError:
            return jsonify({"msg": "Invalid status"}), 400

    if 'expiration_date' in data:
        try:
            pantry_entry.expiration_date = date.fromisoformat(
                data['expiration_date']
            )
        except ValueError:
            return jsonify(
                {"msg": "Invalid expiration date, expected YYYY-MM-DD"}
            ), 400

    if 'ingredient_id' in data:
        ingredient = Ingredient.query.get(
            data['ingredient_id']
        )

        if not ingredient:
            name = data.get('ingredient_name')
            if not name:
                return jsonify(
                    {"msg": "Ingredient not found and no name provided"}
                ), 400

            ingredient = Ingredient(name=name)
            db.session.add(ingredient)
            db.session.flush()

        pantry_entry.ingredient_id = ingredient.id

    db.session.commit()
    return jsonify(pantry_entry_schema.dump(pantry_entry)), 200

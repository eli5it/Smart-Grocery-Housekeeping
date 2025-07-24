from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
import sqlalchemy as sa
from app import db
from app.models.pantry_entry import PantryEntry
from app.models.ingredient import Ingredient

pantry_entry_bp = Blueprint('pantry_entry', __name__, url_prefix='/api/pantry_entry')



@pantry_entry_bp.route('', methods=['GET'])
def search_pantry_entries():
    # get product_name, and ingredient name
    product_name = request.args.get('product_name')
    ingredient_name = request.args.get('ingredient_name')
    if not product_name and not ingredient_name:
        return jsonify({"msg": "invalid request"}), 400

    
    if product_name:
        query = sa.select(PantryEntry).filter(PantryEntry.product_name.startswith(product_name))
        products = db.session.scalars(query).all()
        return jsonify({
            "products" : products
        })
    else:
        query = sa.select(Ingredient).filter(Ingredient.name.startswith(ingredient_name))
        ingredients = db.session.scalars(query).all()
        return jsonify({
            "ingredients" : ingredients
        })

    





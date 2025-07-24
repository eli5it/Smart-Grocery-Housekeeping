from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
import sqlalchemy as sa
from app import db
from app.models.pantry_entry import PantryEntry
from app.models.ingredient import Ingredient
from app.schemas import PantryEntrySchema


pantry_entry_bp = Blueprint('pantry_entry', __name__, url_prefix='/api/pantry_entry')
pantry_entries_schema = PantryEntrySchema(many=True)



@pantry_entry_bp.route('', methods=['GET'])
def search_pantry_entries():
    # get product_name, and ingredient name
    product_name = request.args.get('product_name')
    ingredient_name = request.args.get('ingredient_name')
    if not product_name and not ingredient_name:
        return jsonify({"msg": "invalid request"}), 400

    
    if product_name:
        query = (sa.select(PantryEntry.product_name, Ingredient.name.label('ingredient_name'))
        .join(PantryEntry.ingredient)
        .filter(PantryEntry.product_name.startswith(product_name)))

        results = db.session.execute(query).mappings().all()
        # need results to be serializable
        json_results = [dict(row) for row in results]
        return jsonify({
            "products": json_results
        })

    else:
        query = sa.select(Ingredient.name).filter(Ingredient.name.startswith(ingredient_name))
        results = db.session.scalars(query).all()
        print(results)
        return jsonify({
            "ingredients" : results
        })

    





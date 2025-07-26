from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.models.recipe import Recipe
from app.schemas import RecipeSchema


recipe_bp = Blueprint('recipes', __name__)
recipe_schema = RecipeSchema()


@recipe_bp.route('/recipes/<int:recipe_id>', methods=['GET'])
@jwt_required()
def get_recipe(recipe_id):
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({'message': 'Recipe not found'}), 404
    return jsonify(recipe_schema.dump(recipe)), 200

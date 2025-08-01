from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.orm import Session
from app import db
from app.models.recipe import Recipe
from app.schemas import RecipeSchema
from app.utils.recipe_scoring import score_recipes


recipe_bp = Blueprint('recipes', __name__)
recipe_schema = RecipeSchema()
recipes_schema = RecipeSchema(many=True)


@recipe_bp.route('/recipes/<int:recipe_id>', methods=['GET'])
@jwt_required()
def get_recipe(recipe_id):
    recipe = db.session.get(Recipe, recipe_id)
    if not recipe:
        return jsonify({'message': 'Recipe not found'}), 404
    return jsonify(recipe_schema.dump(recipe)), 200


@recipe_bp.route('/recipes', methods=['GET'])
@jwt_required()
def recommend_recipes():
    user_id = get_jwt_identity()
    session: Session = db.session

    limit = request.args.get('limit', type=int)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    scored_query = score_recipes(session, user_id)

    total_matches = scored_query.count()

    if limit:
        scored = scored_query.limit(limit).all()
    else:
        scored = (
            scored_query
            .offset((page - 1) * per_page)
            .limit(per_page)
            .all()
        )

    recipes = [r[0] for r in scored]

    return jsonify({
        'recipes': recipes_schema.dump(recipes),
        'total': total_matches,
        'page': page,
        'per_page': per_page
    }), 200

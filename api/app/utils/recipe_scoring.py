from datetime import date, timedelta
from app.models import Recipe, RecipeIngredient, PantryEntry, PantryStatus
import sqlalchemy as sa
from sqlalchemy.orm import Session


def score_recipes(session: Session, user_id: int):
    today = date.today()
    near_expiration_threshold = today + timedelta(days=7)

    valid_pantry_sub = session.query(
        PantryEntry.ingredient_id,
        sa.case(
            (PantryEntry.expiration_date <= near_expiration_threshold, 2),
            else_=1
        ).label('weight')
    ).filter(
        PantryEntry.user_id == user_id,
        PantryEntry.status == PantryStatus.IN_STOCK,
        (
            PantryEntry.expiration_date.is_(None)
            | (PantryEntry.expiration_date >= today)
        )
    ).subquery()

    total_ingredients_sub = session.query(
        RecipeIngredient.recipe_id,
        sa.func.count(RecipeIngredient.ingredient_id).label('total_count')
    ).group_by(RecipeIngredient.recipe_id).subquery()

    matching_ingredients_sub = session.query(
        RecipeIngredient.recipe_id,
        sa.func.sum(valid_pantry_sub.c.weight).label('match_score')
    ).join(
        valid_pantry_sub,
        valid_pantry_sub.c.ingredient_id == RecipeIngredient.ingredient_id
    ).group_by(RecipeIngredient.recipe_id).subquery()

    scored = session.query(
        Recipe,
        matching_ingredients_sub.c.match_score,
        total_ingredients_sub.c.total_count,
        (matching_ingredients_sub.c.match_score * 1.0 /
         total_ingredients_sub.c.total_count).label('score')
    ).join(
        total_ingredients_sub, Recipe.id == total_ingredients_sub.c.recipe_id
    ).join(
        matching_ingredients_sub,
        Recipe.id == matching_ingredients_sub.c.recipe_id
    ).order_by(sa.desc('score'))

    return scored

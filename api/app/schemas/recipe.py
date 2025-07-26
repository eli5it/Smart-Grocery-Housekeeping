from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested

from app.models.recipe import Recipe
from app.models.recipe_ingredient import RecipeIngredient
from app.schemas.ingredient import IngredientSchema


class RecipeIngredientLinkSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = RecipeIngredient
        include_fk = True
        load_instance = True
        include_relationships = True

    ingredient = Nested(IngredientSchema, only=('id', 'name'))


class RecipeSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Recipe
        load_instance = True

    canonical_ingredients = Nested(
        RecipeIngredientLinkSchema,
        many=True,
        attribute='ingredient_links'
    )

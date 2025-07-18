from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.ingredient import Ingredient


class IngredientSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Ingredient
        load_instance = True

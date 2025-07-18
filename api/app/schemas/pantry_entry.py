from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested
from app.models.pantry_entry import PantryEntry
from app.schemas.ingredient import IngredientSchema


class PantryEntrySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = PantryEntry
        load_instance = True
        include_fk = True

    ingredient = Nested(IngredientSchema)

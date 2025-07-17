from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.pantry_entry import PantryEntry


class PantryEntrySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = PantryEntry
        load_instance = True
        include_fk = True

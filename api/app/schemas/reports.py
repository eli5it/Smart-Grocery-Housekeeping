from marshmallow import Schema, fields
from marshmallow_sqlalchemy.fields import Nested
from app.schemas.pantry_entry import PantryEntrySchema


class WastedItemSchema(Schema):
    """Schema for wasted item data (aggregated by ingredient)."""
    ingredient_id = fields.Integer(required=True)
    ingredient_name = fields.String(required=True)
    waste_count = fields.Integer(required=True)


class WastedItemsResponseSchema(Schema):
    """Schema for wasted items endpoint response."""
    wasted_items = fields.List(fields.Nested(WastedItemSchema), required=True)
    total_items = fields.Integer(required=True)


class WasteSummarySchema(Schema):
    """Schema for waste summary data."""
    total_pantry_entries = fields.Integer(required=True)
    discarded_items = fields.Integer(required=True)
    used_items = fields.Integer(required=True)
    in_stock_items = fields.Integer(required=True)
    waste_percentage = fields.Float(required=True)
    usage_percentage = fields.Float(required=True)


class WasteSummaryResponseSchema(Schema):
    """Schema for waste summary endpoint response."""
    summary = fields.Nested(WasteSummarySchema, required=True)


class RecentWasteItemSchema(Schema):
    """Schema for recent waste items, leveraging existing PantryEntrySchema."""
    # Use nested PantryEntrySchema for core fields
    pantry_entry = Nested(PantryEntrySchema, only=(
        'id', 'product_name', 'date_added', 'expiration_date', 'ingredient'
    ))
    
    # Flattened fields for API compatibility
    pantry_entry_id = fields.Method('get_pantry_entry_id', dump_only=True)
    product_name = fields.Method('get_product_name', dump_only=True)
    ingredient_name = fields.Method('get_ingredient_name', dump_only=True)
    date_added = fields.Method('get_date_added', dump_only=True)
    expiration_date = fields.Method('get_expiration_date', dump_only=True)

    def get_pantry_entry_id(self, obj):
        """Get the pantry entry ID."""
        return obj.id

    def get_product_name(self, obj):
        """Get the product name."""
        return obj.product_name

    def get_ingredient_name(self, obj):
        """Get the ingredient name from the relationship."""
        return obj.ingredient.name if obj.ingredient else None

    def get_date_added(self, obj):
        """Get the date added as ISO string."""
        return obj.date_added.isoformat() if obj.date_added else None

    def get_expiration_date(self, obj):
        """Get the expiration date as ISO string."""
        return obj.expiration_date.isoformat() if obj.expiration_date else None


class RecentWasteResponseSchema(Schema):
    """Schema for recent waste endpoint response."""
    recent_waste = fields.List(
        fields.Nested(RecentWasteItemSchema), required=True
    )
    count = fields.Integer(required=True)

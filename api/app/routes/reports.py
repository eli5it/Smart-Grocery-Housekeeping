from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.pantry_entry import PantryEntry, PantryStatus
from app.models.ingredient import Ingredient
from app.schemas.reports import (
    WastedItemsResponseSchema, WasteSummaryResponseSchema,
    RecentWasteItemSchema
)
from app import db
import sqlalchemy as sa
from sqlalchemy import func, or_
from datetime import date


reports_bp = Blueprint('reports', __name__)


@reports_bp.route('/reports/wasted-items', methods=['GET'])
@jwt_required()
def get_wasted_items():
    user_id = int(get_jwt_identity())
    today = date.today()

    limit = request.args.get('limit', type=int)

    query = db.session.query(
        Ingredient.id,
        Ingredient.name,
        func.count(PantryEntry.id).label('waste_count')
    ).join(
        PantryEntry, Ingredient.id == PantryEntry.ingredient_id
    ).filter(
        PantryEntry.user_id == user_id,
        or_(
            PantryEntry.status == PantryStatus.DISCARDED,
            sa.and_(
                PantryEntry.status == PantryStatus.IN_STOCK,
                PantryEntry.expiration_date.is_not(None),
                PantryEntry.expiration_date < today
            )
        )
    ).group_by(
        Ingredient.id, Ingredient.name
    ).order_by(
        sa.desc('waste_count')
    )

    if limit is not None and limit > 0:
        query = query.limit(limit)

    wasted_items = query.all()

    results = []
    for item in wasted_items:
        results.append({
            'ingredient_id': item.id,
            'ingredient_name': item.name,
            'waste_count': item.waste_count
        })

    response_data = {
        'wasted_items': results,
        'total_items': len(results)
    }

    schema = WastedItemsResponseSchema()
    return jsonify(schema.dump(response_data)), 200


@reports_bp.route('/reports/waste-summary', methods=['GET'])
@jwt_required()
def get_waste_summary():

    user_id = int(get_jwt_identity())

    total_entries = db.session.query(func.count(PantryEntry.id)).filter(
        PantryEntry.user_id == user_id
    ).scalar()

    discarded_entries = db.session.query(func.count(PantryEntry.id)).filter(
        PantryEntry.user_id == user_id,
        PantryEntry.status == PantryStatus.DISCARDED
    ).scalar()

    used_entries = db.session.query(func.count(PantryEntry.id)).filter(
        PantryEntry.user_id == user_id,
        PantryEntry.status == PantryStatus.USED
    ).scalar()

    in_stock_entries = db.session.query(func.count(PantryEntry.id)).filter(
        PantryEntry.user_id == user_id,
        PantryEntry.status == PantryStatus.IN_STOCK
    ).scalar()

    waste_percentage = (
        (discarded_entries / total_entries * 100)
        if total_entries > 0 else 0
    )
    usage_percentage = (
        (used_entries / total_entries * 100)
        if total_entries > 0 else 0
    )

    response_data = {
        'summary': {
            'total_pantry_entries': total_entries,
            'discarded_items': discarded_entries,
            'used_items': used_entries,
            'in_stock_items': in_stock_entries,
            'waste_percentage': round(waste_percentage, 2),
            'usage_percentage': round(usage_percentage, 2)
        }
    }

    schema = WasteSummaryResponseSchema()
    return jsonify(schema.dump(response_data)), 200


@reports_bp.route('/reports/recent-waste', methods=['GET'])
@jwt_required()
def get_recent_waste():

    user_id = int(get_jwt_identity())

    limit = request.args.get('limit', default=10, type=int)

    recent_waste = db.session.query(PantryEntry).join(
        Ingredient, PantryEntry.ingredient_id == Ingredient.id
    ).filter(
        PantryEntry.user_id == user_id,
        PantryEntry.status == PantryStatus.DISCARDED
    ).order_by(
        sa.desc(PantryEntry.date_added)
    )

    if limit > 0:
        recent_waste = recent_waste.limit(limit)

    recent_waste_items = recent_waste.all()

    item_schema = RecentWasteItemSchema(many=True)
    serialized_items = item_schema.dump(recent_waste_items)

    return jsonify({
        'recent_waste': serialized_items,
        'count': len(serialized_items)
    }), 200

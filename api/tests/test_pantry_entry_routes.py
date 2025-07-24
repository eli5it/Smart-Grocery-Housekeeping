import pytest
from app import db
import json


def test_invalid_search(client):
    """Tests /pantry_entry route with invalid search params"""
    response = client.get('/api/pantry_entry')
    assert response.status_code == 400

def test_search_by_product(client, sample_pantry_entries):
    """pantry_entry route returns search results when querying by product name"""
    response = client.get('/api/pantry_entry?product_name=apple')
    response_json = response.get_json()
    assert len(response_json['products']) == 1
    assert response.status_code == 200

def test_search_by_ingredient(client):
    """pantry_entry route returns search results when querying by ingredient name"""
    response = client.get('/api/pantry_entry?ingredient_name=apple')
    response_json = response.get_json()
    assert(len(response_json['ingredients'])) == 1
    assert response.status_code == 200

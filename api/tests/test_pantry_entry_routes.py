import pytest
from app import db


def test_invalid_search(client):
    """Tests /pantry_entry route with invalid search params"""
    response = client.get('/api/pantry_entry')
    assert response.status_code == 400
    
import pytest
from app import db
from app.models.ingredient import Ingredient
from app.models.pantry_entry import PantryEntry, PantryStatus


@pytest.fixture
def auth_headers(client, test_user):
    response = client.post('/api/login', json={
        'username': test_user.username,
        'password': 'test'
    })
    token = response.get_json()['access_token']
    return {'Authorization': f'Bearer {token}'}


def add_pantry_entry(client, auth_headers):
    data = {
        'name': 'Test Ingredient',
        'expiration_date': '2024-12-31'
    }
    response = client.post('/api/pantry', json=data, headers=auth_headers)
    assert response.status_code == 201
    assert response.get_json()['msg'] == 'Pantry entry added successfully'


def test_delete_pantry_entry(client, auth_headers, test_user):
    # Add a pantry entry to delete
    ingredient = Ingredient(name='Granola')
    db.session.add(ingredient)
    db.session.flush()

    entry = PantryEntry(user_id=test_user.id,
                        ingredient_id=ingredient.id)
    db.session.add(entry)
    db.session.commit()

    response = client.delete(f'/api/pantry/{entry.id}', headers=auth_headers)
    assert response.status_code == 200
    assert response.get_json()['msg'] == 'Pantry entry deleted successfully'


def test_update_pantry_entry(client, auth_headers, test_user):
    ingredient = Ingredient(name='Oats')
    db.session.add(ingredient)
    db.session.flush()

    entry = PantryEntry(user_id=test_user.id,
                        ingredient_id=ingredient.id)
    db.session.add(entry)
    db.session.commit()

    response = client.patch(f'/api/pantry/{entry.id}', json={
        'status': 'out_of_stock'
    }, headers=auth_headers)

    assert response.status_code == 200
    assert response.get_json()['status'] == PantryStatus.OUT_OF_STOCK.value

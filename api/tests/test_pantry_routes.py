from app import db
from app.models.ingredient import Ingredient
from app.models.pantry_entry import PantryEntry, PantryStatus

def test_add_pantry_entry(client, auth_headers):
    """Tests adding one valid pantry_entry that does not exist in the db"""
    data = { 
        "pantry_entries" : [{
        'name': 'Test Ingredient',
        'expiration_date': '2024-12-31',
        'product_name' : 'Test Product'
    }]
    }
        
    response = client.post('/api/pantry', json=data, headers=auth_headers)
    assert response.status_code == 201
    assert response.get_json()['msg'] == 'Pantry entries added successfully'


def test_add_multiple_pantry_entries(client, auth_headers):
    """Tests adding multiple valid pantry entries"""
    data = { 
        "pantry_entries" : [{
        'name': 'Test Ingredient',
        'expiration_date': '2024-12-31',
        'product_name' : 'Test Product'
    }, 
    {
        'name': 'Test Ingredient 2',
        'expiration_date': '2024-12-23',
        'product_name' : 'Test Product 2'
    }]}

    response = client.post('/api/pantry', json=data, headers=auth_headers)
    assert response.status_code == 201
    assert response.get_json()['msg'] == 'Pantry entries added successfully'

def test_add_invalid_pantry_entries(client, auth_headers):
    """Test should fail when an invalid pantry entry is in the data"""
    data = { 
        "pantry_entries" : [{
        'name': 'Test Ingredient',
        'expiration_date': '2024-12-31',
        'product_name' : 'Test Product'
    }, 
    {
        'fname': 'Test Ingredient 2',
        'expiration_date': '2024-12-23',
        'product_name' : 'Test Product 2'
    }]}

    response = client.post('/api/pantry', json=data, headers=auth_headers)
    assert response.status_code == 400




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

def test_get_pantry_stats_unauthorized(client, auth_headers):
    """Unauthorized requests result in 401 API Response"""
    response = client.get('/api/pantry/stats')
    assert response.status_code == 401
    
def test_get_pantry_stats_empty(client, auth_headers):
    """Stats for a user with a pantry are correct"""
    response = client.get('/api/pantry/stats', headers = auth_headers)
    response_json = response.get_json()
    print(response_json)
    assert 'total' in response_json
    assert 'expired' in response_json
    assert 'expiring' in response_json

    
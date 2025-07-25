from app import db


def test_invalid_search(client):
    """Tests /pantry_entry route with invalid search params"""
    response = client.get('/api/pantry_entry')
    assert response.status_code == 400

def test_search_by_product(client, sample_pantry_entries):
    """pantry_entry route returns search results when querying by product name"""
    response1 = client.get('/api/pantry_entry?product_name=apple')
    response2 = client.get('/api/pantry_entry?product_name=apple')

    response1_json = response1.get_json()
    response2_json = response2.get_json()

    assert len(response1_json['products']) == 1
    assert len(response2_json['products']) == 1

    assert response1.status_code == 200
    assert response2.status_code == 200


def test_search_by_ingredient(client, sample_pantry_entries):
    """pantry_entry route returns search results when querying by ingredient name"""
    response1 = client.get('/api/pantry_entry?ingredient_name=apple')
    response2 = client.get('/api/pantry_entry?ingredient_name=pasta')
    response1_json = response1.get_json()
    response2_json = response2.get_json()

    assert(len(response1_json['ingredients'])) == 1
    assert(len(response2_json['ingredients'])) == 1

    assert response1.status_code == 200
    assert response2.status_code == 200


def test_empty_ingredient_search(client, sample_pantry_entries):
    """Tests /pantry_entry ingredient search when there are no matching entries"""
    response = client.get('/api/pantry_entry?ingredient_name=afasdfdsa')
    response_json = response.get_json()
    assert(len(response_json['ingredients'])) == 0
    assert response.status_code == 200

def test_empty_product_search(client, sample_pantry_entries):
    """Tests /pantry_entry product search when there are no matching entries"""
    response = client.get('/api/pantry_entry?product_name=afasdfdsa')
    response_json = response.get_json()
    assert(len(response_json['products'])) == 0
    assert response.status_code == 200

def test_partial_search(client, sample_pantry_entries):
    """Results are correct with valid product/ingredient prefix"""
    response1 = client.get('/api/pantry_entry?product_name=a')
    response2 = client.get('/api/pantry_entry?ingredient_name=p')
    response1_json = response1.get_json()
    response2_json = response2.get_json()
    assert(len(response1_json['products'])) == 1
    assert(len(response2_json['ingredients'])) == 1


def test_exclusive_search(client, sample_pantry_entries):
    """Results include ingredients or products, not both"""
    response1 = client.get('/api/pantry_entry?product_name=a')
    response2 = client.get('/api/pantry_entry?ingredient_name=p')
    response1_json = response1.get_json()
    response2_json = response2.get_json()
    assert 'ingredients' not in response1_json
    assert 'products' not in response2_json
   

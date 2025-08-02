from flask import json
from app.models.pantry_entry import PantryEntry, PantryStatus
from app.models.ingredient import Ingredient
from app import db


class TestReportsRoutes:
    """Test reports routes functionality."""

    def test_wasted_items_requires_auth(self, client):
        """Test that wasted items endpoint requires authentication."""
        response = client.get('/api/reports/wasted-items')
        assert response.status_code == 401

    def test_wasted_items_success(self, client, test_user, test_app):
        """Test successful retrieval of wasted items."""
        with test_app.app_context():
            # Create a test ingredient
            ingredient = Ingredient(name="Test Milk")
            db.session.add(ingredient)
            db.session.commit()

            # Create some discarded pantry entries
            discarded_entry1 = PantryEntry(
                ingredient_id=ingredient.id,
                user_id=test_user.id,
                product_name="Expired Milk",
                status=PantryStatus.DISCARDED
            )
            discarded_entry2 = PantryEntry(
                ingredient_id=ingredient.id,
                user_id=test_user.id,
                product_name="Old Milk",
                status=PantryStatus.DISCARDED
            )

            db.session.add_all([discarded_entry1, discarded_entry2])
            db.session.commit()

            # Login and get token
            login_response = client.post('/api/login', json={
                'username': test_user.username,
                'password': 'test'
            })
            token = json.loads(login_response.data)['access_token']

            # Test the wasted items endpoint without limit
            response = client.get(
                '/api/reports/wasted-items',
                headers={'Authorization': f'Bearer {token}'}
            )

            assert response.status_code == 200
            data = json.loads(response.data)
            assert 'wasted_items' in data
            assert data['total_items'] >= 1
            ingredient_name = data['wasted_items'][0]['ingredient_name']
            assert ingredient_name == ingredient.name
            assert data['wasted_items'][0]['waste_count'] == 2

    def test_wasted_items_with_limit(self, client, test_user, test_app):
        """Test wasted items endpoint with limit parameter."""
        with test_app.app_context():
            # Create a test ingredient
            ingredient = Ingredient(name="Test Bread")
            db.session.add(ingredient)
            db.session.commit()

            # Create some discarded pantry entries
            discarded_entry1 = PantryEntry(
                ingredient_id=ingredient.id,
                user_id=test_user.id,
                product_name="Expired Bread",
                status=PantryStatus.DISCARDED
            )
            discarded_entry2 = PantryEntry(
                ingredient_id=ingredient.id,
                user_id=test_user.id,
                product_name="Old Bread",
                status=PantryStatus.DISCARDED
            )

            db.session.add_all([discarded_entry1, discarded_entry2])
            db.session.commit()

            # Login and get token
            login_response = client.post('/api/login', json={
                'username': test_user.username,
                'password': 'test'
            })
            token = json.loads(login_response.data)['access_token']

            # Test the wasted items endpoint with limit=1
            response = client.get(
                '/api/reports/wasted-items?limit=1',
                headers={'Authorization': f'Bearer {token}'}
            )

            assert response.status_code == 200
            data = json.loads(response.data)
            assert 'wasted_items' in data
            assert data['total_items'] <= 1

    def test_waste_summary_success(self, client, test_user, test_app):
        """Test successful retrieval of waste summary."""
        with test_app.app_context():
            # Create a test ingredient
            ingredient = Ingredient(name="Test Carrots")
            db.session.add(ingredient)
            db.session.commit()

            # Create pantry entries with different statuses
            discarded_entry = PantryEntry(
                ingredient_id=ingredient.id,
                user_id=test_user.id,
                status=PantryStatus.DISCARDED
            )
            used_entry = PantryEntry(
                ingredient_id=ingredient.id,
                user_id=test_user.id,
                status=PantryStatus.USED
            )
            in_stock_entry = PantryEntry(
                ingredient_id=ingredient.id,
                user_id=test_user.id,
                status=PantryStatus.IN_STOCK
            )

            db.session.add_all([discarded_entry, used_entry, in_stock_entry])
            db.session.commit()

            # Login and get token
            login_response = client.post('/api/login', json={
                'username': test_user.username,
                'password': 'test'
            })
            token = json.loads(login_response.data)['access_token']

            # Test the waste summary endpoint
            response = client.get(
                '/api/reports/waste-summary',
                headers={'Authorization': f'Bearer {token}'}
            )

            assert response.status_code == 200
            data = json.loads(response.data)
            assert 'summary' in data
            summary = data['summary']
            assert summary['total_pantry_entries'] >= 3
            assert summary['discarded_items'] >= 1
            assert summary['used_items'] >= 1
            assert summary['in_stock_items'] >= 1
            assert 'waste_percentage' in summary
            assert 'usage_percentage' in summary

    def test_recent_waste_success(self, client, test_user, test_app):
        """Test successful retrieval of recent waste."""
        with test_app.app_context():
            # Create a test ingredient
            ingredient = Ingredient(name="Test Apples")
            db.session.add(ingredient)
            db.session.commit()

            # Create a recent discarded entry
            discarded_entry = PantryEntry(
                ingredient_id=ingredient.id,
                user_id=test_user.id,
                product_name="Spoiled Apples",
                status=PantryStatus.DISCARDED
            )

            db.session.add(discarded_entry)
            db.session.commit()

            # Login and get token
            login_response = client.post('/api/login', json={
                'username': test_user.username,
                'password': 'test'
            })
            token = json.loads(login_response.data)['access_token']

            # Test the recent waste endpoint
            response = client.get(
                '/api/reports/recent-waste',
                headers={'Authorization': f'Bearer {token}'}
            )

            assert response.status_code == 200
            data = json.loads(response.data)
            assert 'recent_waste' in data
            assert data['count'] >= 1
            if data['recent_waste']:
                waste_item = data['recent_waste'][0]
                assert 'pantry_entry_id' in waste_item
                assert 'product_name' in waste_item
                assert 'ingredient_name' in waste_item

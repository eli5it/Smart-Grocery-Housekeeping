import pytest
from app import create_app, db
from app.models.user import User
from app.models.pantry_entry import PantryEntry
from app.models.ingredient import Ingredient
from app.models.recipe import Recipe
from werkzeug.security import generate_password_hash
from bulk_import import load_recipe_data
import os

# Set environment variables for google application credentials
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = './api/vision_service_key.json'
@pytest.fixture(scope='module')
def test_app():
    app = create_app({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'JWT_SECRET_KEY': 'test_secret'
    })

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(test_app):
    return test_app.test_client()


@pytest.fixture
def test_user(test_app):
    with test_app.app_context():
        user = User.query.filter_by(username='testuser').first()
        if not user:
            user = User(username='testuser',
                        password_hash=generate_password_hash('test'))
            db.session.add(user)
            db.session.commit()
        return db.session.get(User, user.id)

@pytest.fixture
def sample_pantry_entries(test_app, test_user):
    with test_app.app_context():
        ingredient_exists = Ingredient.query.filter_by(name = 'apple').first()
        if not ingredient_exists:
            ingredient1 = Ingredient(name = "apple")
            ingredient2 = Ingredient(name = "pasta")
            db.session.add_all((ingredient1, ingredient2))
            db.session.commit()
 
            pantry_entry1 = PantryEntry(ingredient = ingredient1, product_name = "Barilla Pasta", user = test_user)
            pantry_entry2 = PantryEntry(ingredient = ingredient2, product_name = "apple", user = test_user)

            db.session.add_all([pantry_entry1, pantry_entry2])
            db.session.commit()


@pytest.fixture
def auth_headers(client, test_user):
    response = client.post('/api/login', json={
        'username': test_user.username,
        'password': 'test'
    })
    token = response.get_json()['access_token']
    return {'Authorization': f'Bearer {token}'}

@pytest.fixture
def populate_db():
    recipe_count = db.session.query(Recipe).count()
    # do not want to execute expensive sql query multiple times
    if recipe_count < 10:
        print('populating recipes')
        load_recipe_data('./api/data/matching_recipes.json')
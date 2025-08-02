import pytest
from app import create_app, db
from app.models.user import User
from app.models.pantry_entry import PantryEntry, PantryStatus
from app.models.ingredient import Ingredient
from app.models.recipe import Recipe
from app.models.recipe_ingredient import RecipeIngredient
from werkzeug.security import generate_password_hash
from bulk_import import load_recipe_data
import os
from pathlib import Path

recipe_path = Path(__file__).parent.parent / "data" / "matching_recipes.json"

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
        ingredient_exists = Ingredient.query.filter_by(name='apple').first()
        if not ingredient_exists:
            ingredient1 = Ingredient(name="apple")
            ingredient2 = Ingredient(name="pasta")
            db.session.add_all((ingredient1, ingredient2))
            db.session.commit()

            pantry_entry1 = PantryEntry(
                ingredient=ingredient1,
                product_name="Barilla Pasta",
                user=test_user
            )
            pantry_entry2 = PantryEntry(
                ingredient=ingredient2,
                product_name="apple",
                user=test_user
            )

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
        load_recipe_data(recipe_path)


@pytest.fixture
def recipe_ingredient(test_app, recipe, ingredient):
    new_link = RecipeIngredient(
        recipe_id=recipe.id,
        ingredient_id=ingredient.id,
    )
    test_app.session.add(new_link)
    test_app.session.commit()
    return new_link


@pytest.fixture
def sample_recipe(test_app):
    with test_app.app_context():
        recipe = Recipe(
            name="Sample Recipe",
            instructions=["Step 1: Prepare ingredients", "Step 2: Cook",
                          "Step 3: Serve"],
            ingredients=["Salt", "Pepper", "Chicken"]
        )
        db.session.add(recipe)
        db.session.commit()
        return db.session.get(Recipe, recipe.id)


@pytest.fixture
def multiple_recipes(test_app):
    with test_app.app_context():
        recipes = []
        for i in range(5):
            recipe = Recipe(
                name=f"Recipe {i+1}",
                instructions=[f"Step 1 for recipe {i+1}",
                              f"Step 2 for recipe {i+1}"],
                ingredients=[f"ingredient_{i}", f"ingredient_{i+1}"]
            )
            recipes.append(recipe)

        db.session.add_all(recipes)
        db.session.commit()

        # Return fresh instances from the database
        return [db.session.get(Recipe, recipe.id) for recipe in recipes]


@pytest.fixture
def recommendation_setup(test_app, test_user):
    """Setup data for testing recipe recommendations"""
    with test_app.app_context():
        # Check for existing ingredients first, create only if they don't exist
        salt = Ingredient.query.filter_by(name="Salt").first()
        if not salt:
            salt = Ingredient(name="Salt")
            db.session.add(salt)
        
        pepper = Ingredient.query.filter_by(name="Pepper").first()
        if not pepper:
            pepper = Ingredient(name="Pepper")
            db.session.add(pepper)
        
        chicken = Ingredient.query.filter_by(name="Chicken").first()
        if not chicken:
            chicken = Ingredient(name="Chicken")
            db.session.add(chicken)
        
        pasta = Ingredient.query.filter_by(name="Pasta").first()
        if not pasta:
            pasta = Ingredient(name="Pasta")
            db.session.add(pasta)
        
        tomato = Ingredient.query.filter_by(name="Tomato").first()
        if not tomato:
            tomato = Ingredient(name="Tomato")
            db.session.add(tomato)
            
        db.session.flush()

        # Create unique recipes for recommendations
        recipe1 = Recipe(
            name="Chicken and Salt Recipe",
            instructions=["Season chicken with salt", "Cook"],
            ingredients=["Chicken", "Salt"]
        )
        recipe2 = Recipe(
            name="Pasta with Tomato Recipe",
            instructions=["Boil pasta", "Add tomato sauce"],
            ingredients=["Pasta", "Tomato"]
        )
        recipe3 = Recipe(
            name="Full Recipe Mix",
            instructions=["Use all ingredients"],
            ingredients=["Salt", "Pepper", "Chicken", "Pasta", "Tomato"]
        )
        db.session.add_all([recipe1, recipe2, recipe3])
        db.session.flush()

        # Create recipe-ingredient links
        links = [
            RecipeIngredient(recipe_id=recipe1.id, ingredient_id=chicken.id),
            RecipeIngredient(recipe_id=recipe1.id, ingredient_id=salt.id),
            RecipeIngredient(recipe_id=recipe2.id, ingredient_id=pasta.id),
            RecipeIngredient(recipe_id=recipe2.id, ingredient_id=tomato.id),
            RecipeIngredient(recipe_id=recipe3.id, ingredient_id=salt.id),
            RecipeIngredient(recipe_id=recipe3.id, ingredient_id=pepper.id),
            RecipeIngredient(recipe_id=recipe3.id, ingredient_id=chicken.id),
            RecipeIngredient(recipe_id=recipe3.id, ingredient_id=pasta.id),
            RecipeIngredient(recipe_id=recipe3.id, ingredient_id=tomato.id),
        ]
        db.session.add_all(links)

        # Create pantry entries for the user (only some ingredients)
        pantry_entries = [
            PantryEntry(
                user_id=test_user.id,
                ingredient_id=salt.id,
                product_name="Table Salt",
                status=PantryStatus.IN_STOCK
            ),
            PantryEntry(
                user_id=test_user.id,
                ingredient_id=chicken.id,
                product_name="Chicken Breast",
                status=PantryStatus.IN_STOCK
            ),
            PantryEntry(
                user_id=test_user.id,
                ingredient_id=pasta.id,
                product_name="Spaghetti",
                status=PantryStatus.USED
            )
        ]
        db.session.add_all(pantry_entries)
        db.session.commit()

        return {
            "ingredients": {
                "salt": salt,
                "pepper": pepper,
                "chicken": chicken,
                "pasta": pasta,
                "tomato": tomato
            },
            "recipes": {
                "chicken_salt": recipe1,
                "pasta_tomato": recipe2,
                "full_recipe": recipe3
            },
            "pantry_entries": pantry_entries
        }


@pytest.fixture
def setup_data(test_app):
    with test_app.app_context():
        # Create ingredients
        salt = Ingredient(name="Salt")
        pepper = Ingredient(name="Pepper")
        chicken = Ingredient(name="Chicken Breast")
        db.session.add_all([salt, pepper, chicken])
        db.session.flush()  # flush to assign IDs

        # Create recipe
        recipe = Recipe(
            name="Grilled Chicken",
            ingredients=[chicken, salt, pepper],
            instructions=["Season chicken", "Grill for 10 minutes each side"]
        )
        db.session.add(recipe)
        db.session.commit()

        return {
            "ingredients": {
                "salt": salt,
                "pepper": pepper,
                "chicken": chicken
            },
            "recipe": recipe
        }

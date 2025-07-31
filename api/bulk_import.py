import json
from app import create_app
from app import db
from app.models import Ingredient, Recipe, RecipeIngredient, User, PantryEntry
import ijson
import sqlalchemy as sa
from werkzeug.security import check_password_hash, generate_password_hash
import random
from datetime import date, timedelta

def load_recipe_data(recipe_file_path = './data/matching_recipes.json'):
    with open(recipe_file_path, 'rb') as file:
        for recipe_dict in ijson.items(file, 'item'):
            ner_string = recipe_dict['NER'].lower()
            recipe_name = recipe_dict['title'].lower()
            ners = json.loads(ner_string)
            ingredients = []
            # add ingredients
            for name in ners:
                # if ingredient already in DB
                stmt = sa.select(Ingredient).where(Ingredient.name == name)
                ingredient = db.session.execute(stmt).scalar()
                if ingredient is None:
                    ingredient = Ingredient(name = name)
                    db.session.add(ingredient)
                ingredients.append(ingredient)
            
            json_ingredients = json.loads(recipe_dict['ingredients'])
            json_directions = json.loads(recipe_dict['directions'])
            recipe = Recipe(name = recipe_name, ingredients = json_ingredients, instructions = json_directions)
            db.session.add(recipe)
            # make sure recipe id is not None
            db.session.flush()

            for ingredient in ingredients:
                link = RecipeIngredient(recipe = recipe, ingredient = ingredient )
                db.session.add(link)
            db.session.commit()
        
            
def create_test_user(username = "test_user", password = 'password'):
    user = db.session.execute(
        sa.select(User).where(User.username == username)).scalar_one_or_none()

    if user is None:
        password_hash = generate_password_hash(password)
        user = User(username = username, password_hash = password_hash)
    
        db.session.add(user)
        db.session.commit()

    ingredient_stmt = sa.select(Ingredient)
    all_ingredients = db.session.execute(ingredient_stmt).scalars().all()
    ingredient_count = len(all_ingredients)
    # fake prefixes for product names
    prefixes = ["John's Famous", "Trader Joe's", "Harvest Grove", "MeadowFresh", "Evergreen Pantry", "Friendly Table", "CountryLane"]

    time_deltas = [-2, -1, 0, 1, 2, 7, 8, 9, 10, 14, 21]
    delta_idx = 0
    prefix_idx = 0
    # test_user will have every 4th ingredient in their cupboard
    for i in range(0, ingredient_count, 4):
        ingredient = all_ingredients[i]
        prefix = prefixes[prefix_idx % len(prefixes)]
        product_name = f"{prefix} {ingredient.name.capitalize()}"
        # quantity ranges from 1 to 5
        count = (prefix_idx % (len(prefixes) - 2)) + 1
        today = date.today()
        # add different quantities of ingredients
        for j in range(count):
            expiration_date = today + timedelta(time_deltas[delta_idx % len(time_deltas)])
            new_entry = PantryEntry(
                                    ingredient_id=ingredient.id,
                                    user_id=user.id,
                                    expiration_date=expiration_date,
                                    product_name= product_name,
                                    status="in_stock"
            )
            db.session.add(new_entry)
            delta_idx += 1

        prefix_idx += 1
    
    db.session.commit()
        
if __name__ == "__main__":
    from app import create_app
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
        load_recipe_data()
        create_test_user()

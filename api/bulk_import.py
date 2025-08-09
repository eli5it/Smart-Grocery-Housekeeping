import json
from app import create_app
from app import db
from app.models import Ingredient, Recipe, RecipeIngredient, User, PantryEntry
import ijson
import sqlalchemy as sa
from werkzeug.security import check_password_hash, generate_password_hash
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
                    try:
                        db.session.commit()  # Commit immediately to avoid duplicates
                    except Exception as e:
                        db.session.rollback()
                        # Check if it was inserted by another process/transaction
                        ingredient = db.session.execute(stmt).scalar()
                        if ingredient is None:
                            print(f"ERROR: Could not create or find ingredient '{name}': {e}")
                            continue
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
    print(f"Attempting to create user: {username}")

    # Check if user already exists
    user = db.session.execute(
        sa.select(User).where(User.username == username)).scalar_one_or_none()

    if user is not None:
        print(f"User {username} already exists, skipping user creation")
        return  # Don't create duplicate users

    try:
        # Create new user
        password_hash = generate_password_hash(password)
        user = User(username=username, password_hash=password_hash)
        db.session.add(user)
        db.session.commit()
        print(f"Successfully created user: {username}")

        # Verify user was created
        user_check = db.session.execute(
            sa.select(User).where(User.username == username)).scalar_one_or_none()
        if user_check:
            print(f"User verification successful: {username} (ID: {user_check.id})")
        else:
            print(f"ERROR: User verification failed for {username}")
            return

    except Exception as e:
        print(f"ERROR creating user {username}: {e}")
        db.session.rollback()
        return

    # Create pantry entries
    ingredient_stmt = sa.select(Ingredient)
    all_ingredients = db.session.execute(ingredient_stmt).scalars().all()
    ingredient_count = len(all_ingredients)
    print(f"Creating pantry entries for {ingredient_count} ingredients...")

    if ingredient_count == 0:
        print("WARNING: No ingredients found, cannot create pantry entries")
        return

    # fake prefixes for product names
    prefixes = ["John's Famous", "Trader Joe's", "Harvest Grove", "MeadowFresh", "Evergreen Pantry", "Friendly Table", "CountryLane"]

    time_deltas = [-2, -1, 0, 1, 2, 7, 8, 9, 10, 14, 21]
    delta_idx = 0
    prefix_idx = 0
    pantry_count = 0

    try:
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
                                        product_name=product_name,
                                        status="in_stock"
                )
                db.session.add(new_entry)
                pantry_count += 1
                delta_idx += 1

            prefix_idx += 1

        db.session.commit()
        print(f"Successfully created {pantry_count} pantry entries for user {username}")

    except Exception as e:
        print(f"ERROR creating pantry entries: {e}")
        db.session.rollback()

if __name__ == "__main__":
    print("=== BULK IMPORT SCRIPT STARTING ===")
    try:
        app = create_app()
        print("Flask app created successfully")
    except Exception as e:
        print(f"ERROR creating Flask app: {e}")
        import traceback
        traceback.print_exc()
        exit(1)

    with app.app_context():
        # Don't drop/create tables - migrations already handled this
        print("Starting bulk import...")

        try:
            print("Loading recipe data...")
            load_recipe_data()
            print("Recipe data loaded successfully")

            print("Creating test user...")
            create_test_user()
            print("Test user creation completed")

            # Final verification
            user_count = db.session.execute(sa.select(sa.func.count(User.id))).scalar()
            recipe_count = db.session.execute(sa.select(sa.func.count(Recipe.id))).scalar()
            ingredient_count = db.session.execute(sa.select(sa.func.count(Ingredient.id))).scalar()

            print(f"Final counts: {user_count} users, {recipe_count} recipes, {ingredient_count} ingredients")
            print("Bulk import completed!")

        except Exception as e:
            print(f"ERROR during bulk import: {e}")
            import traceback
            traceback.print_exc()

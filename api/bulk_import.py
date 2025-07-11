import pandas as pd
from app import create_app
from app import db
from app.models import Ingredient


app = create_app()
app.app_context().push()

df = pd.read_csv('api/data/recipes_ingredients_small.csv')

all_ingredients = set()
for row in df['Ingredients'].dropna():
    try:
        ingredients_list = eval(row)
        cleaned = [i.lower().strip() for i in ingredients_list]
        all_ingredients.update(cleaned)
    except Exception as e:
        print(f"Skipping row due to error: {e}")
        continue

print(f"🧂 Found {len(all_ingredients)} unique ingredients.")

db.drop_all()
db.create_all()

ingredient_objects = [Ingredient(name=name, image="") for name in sorted(all_ingredients)]
db.session.add_all(ingredient_objects)
db.session.commit()

print("Bulk ingredient import complete.")

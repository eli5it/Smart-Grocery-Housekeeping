import json
from app import create_app
from app import db
from app.models import Ingredient, Recipe, RecipeIngredient
import ijson
import sqlalchemy as sa



app = create_app()
app.app_context().push()


recipe_file_path = './data/matching_recipes.json'

db.drop_all()
db.create_all()
try:
    with open(recipe_file_path, 'r') as file:
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
          

        
        
except Exception as e:
    print(e)
    print('Could not read ingredients data')
import pandas as pd
import json
import ast

df = pd.read_csv('./data/recipe-ingredients-large.csv')

all_ingredients = set()

i = 0
for row in df['NER'].dropna():
    try:
        ingredients_list = ast.literal_eval(row)
        cleaned = [i.lower().strip() for i in ingredients_list]
        all_ingredients.update(cleaned)
    except Exception as e:
        print(f"Skipping row due to error: {e}")
        continue

file_path = "data.json"
with open(file_path, 'w', encoding='utf-8') as file:
    json.dump(list(all_ingredients), file, indent=4, ensure_ascii=False)






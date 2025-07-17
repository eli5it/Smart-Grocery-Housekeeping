import pandas as pd
import ast
import json
import os

# Load canonical ingredients
with open('data/canonical_ingredients.json', 'r', encoding='utf-8') as f:
    canonical_ingredients = set(json.load(f))

# List to hold matching rows
matching_rows = []

# Loop through all chunk CSVs
for filename in os.listdir('data'):
    if filename.startswith('chunk_') and filename.endswith('.csv'):
        chunk_path = os.path.join('data', filename)
        df = pd.read_csv(chunk_path)

        for _, row in df.iterrows():
            ner_raw = row.get('NER')
            if pd.isna(ner_raw):
                continue
            try:
                ner_items = ast.literal_eval(ner_raw)
                cleaned = [item.lower().strip() for item in ner_items if isinstance(item, str)]
                if all(item in canonical_ingredients for item in cleaned):
                    matching_rows.append(row)
            except Exception as e:
                print(f"Skipping row in {filename} due to error: {e}")
                continue

# Combine all matching rows into one DataFrame
if matching_rows:
    matching_df = pd.DataFrame(matching_rows)
    output_csv_path = 'data/matching_recipes.csv'
    matching_df.to_csv(output_csv_path, index=False)
    print(f"Saved {len(matching_df)} matching recipes to {output_csv_path}")
else:
    print("No matching recipes found.")

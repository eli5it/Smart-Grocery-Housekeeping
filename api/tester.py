import pandas as pd
import json

# Load the CSV
csv_path = 'data/matching_recipes.csv'
df = pd.read_csv(csv_path)

# Get first 3 rows as list of dicts
first_three = df.head(3).to_dict(orient='records')

# Print as formatted JSON
print(json.dumps(first_three, indent=4, ensure_ascii=False))

#!/bin/bash
set -e

cd /app/api
export FLASK_APP=run.py

echo "=== Database Migration Setup ==="

# Check if database reset is requested
if [ "$RESET_DATABASE" = "true" ]; then
    echo "RESET_DATABASE=true detected - clearing database..."
    rm -f app.db
    echo "Database file removed"
fi

echo "Running database migrations..."
flask db upgrade

echo "Checking if database needs initial data..."
python -c "
from app import create_app, db
from app.models import User
import sqlalchemy as sa

app = create_app()
with app.app_context():
    user_count = db.session.execute(sa.select(sa.func.count(User.id))).scalar()
    print(f'Users in database: {user_count}')
    if user_count == 0:
        print('Database is empty, will run bulk import...')
        exit(0)  # Run bulk import
    else:
        print('Database has data, skipping bulk import')
        exit(1)  # Skip bulk import
"

if [ $? -eq 0 ]; then
    echo "=== Running Bulk Import ==="
    if [ -f "./data/matching_recipes.json" ]; then
        echo "Found recipe data file, importing..."
        python bulk_import.py
        echo "Bulk import completed successfully!"
        
        # Verify the import worked
        python -c "
from app import create_app, db
from app.models import User, Recipe, Ingredient
import sqlalchemy as sa

app = create_app()
with app.app_context():
    user_count = db.session.execute(sa.select(sa.func.count(User.id))).scalar()
    recipe_count = db.session.execute(sa.select(sa.func.count(Recipe.id))).scalar()
    ingredient_count = db.session.execute(sa.select(sa.func.count(Ingredient.id))).scalar()
    print(f'Import results: {user_count} users, {recipe_count} recipes, {ingredient_count} ingredients')
"
    else
        echo "WARNING: Recipe data file not found at ./data/matching_recipes.json"
        echo "Creating minimal test user anyway..."
        python -c "
from app import create_app, db
from app.models import User
from werkzeug.security import generate_password_hash

app = create_app()
with app.app_context():
    password_hash = generate_password_hash('password')
    user = User(username='test_user', password_hash=password_hash)
    db.session.add(user)
    db.session.commit()
    print('Created basic test user: test_user / password')
"
    fi
else
    echo "Skipping bulk import - database already has data"
fi

echo "=== Starting Application ==="
exec gunicorn --bind 0.0.0.0:5000 run:app
from flask import Flask, send_from_directory, request
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import sqlalchemy as sa
import sqlalchemy.orm as so
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(test_config=None):
    static_folder = os.path.abspath("./dist")
    app = Flask(__name__, static_folder=static_folder, static_url_path="/")

    if test_config:
        app.config.from_mapping(test_config)
    else:
        app.config.from_object(Config)
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False

    # Initialize CORS for API routes only
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)


    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {"status": "ok"}, 200

    # Shell context for Flask CLI
    @app.shell_context_processor
    def make_shell_context():
        from app.models import (
            Ingredient, User, Recipe, PantryEntry, RecipeIngredient
        )
        from app.utils.recipe_scoring import score_recipes
        return {
            'sa': sa, 'so': so, 'db': db, 'Ingredient': Ingredient,
            'User': User, 'recipe': Recipe, 'PantryItem': PantryEntry,
            'RecipeIngredient': RecipeIngredient,
            'score_recipes': score_recipes
        }

    # Register blueprints
    from app.routes.ingredient import ingredient_bp
    from app.routes.barcode import barcode_bp
    from app.routes.login import login_bp
    from app.routes.pantry import pantry_bp
    from app.routes.pantry_entry import pantry_entry_bp
    from app.routes.vision import vision_bp
    from app.routes.recipe import recipe_bp
    from app.routes.reports import reports_bp

    app.register_blueprint(ingredient_bp)
    app.register_blueprint(barcode_bp)
    app.register_blueprint(login_bp, url_prefix='/api')
    app.register_blueprint(pantry_bp, url_prefix='/api')
    app.register_blueprint(pantry_entry_bp)
    app.register_blueprint(vision_bp)
    app.register_blueprint(recipe_bp, url_prefix='/api')
    app.register_blueprint(reports_bp, url_prefix='/api')

    # Serve index.html and let client handle routing
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_spa(path):
        if path and os.path.isfile(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        index_path = os.path.join(app.static_folder, 'index.html')
        if not os.path.isfile(index_path):
            return {"error": f"index.html not found at {index_path}"}, 500
        # Will allow react to takeover
        return send_from_directory(app.static_folder, 'index.html')

    

    # client-side handles 404s
    @app.errorhandler(404)
    def not_found(error):
        index_path = os.path.join(app.static_folder, 'index.html')
        if not os.path.isfile(index_path):
            return {"error": f"index.html not found at {index_path}"}, 500
        return send_from_directory(app.static_folder, 'index.html'), 200

    return app
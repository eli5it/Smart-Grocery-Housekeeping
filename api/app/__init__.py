from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import sqlalchemy as sa
import sqlalchemy.orm as so
from flask import send_from_directory
import os



db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app(test_config=None):
    app = Flask(__name__, static_folder="../dist", static_url_path="/")


    if test_config:
        app.config.from_mapping(test_config)
    else:
        app.config.from_object(Config)
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False
    CORS(app)

    # Initialize extensions with this app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_react(path):
        static_folder = app.static_folder
        target = os.path.join(static_folder, path)

        if path != "" and os.path.exists(target):
            return send_from_directory(static_folder, path)
        else:
            return send_from_directory(static_folder, "index.html")

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {"status": "ok"}, 200

    @app.shell_context_processor
    def make_shell_context():
        # DO NOT MOVE imports
        # need to perform imports here to avoid circular dependency issue
        from app.models import (
            Ingredient, User, Recipe, PantryEntry, RecipeIngredient
        )
        from app.utils.recipe_scoring import score_recipes
        return {'sa': sa, 'so': so, 'db': db, 'Ingredient': Ingredient,
                'User': User, 'recipe': Recipe, 'PantryItem': PantryEntry,
                'RecipeIngredient': RecipeIngredient,
                'score_recipes': score_recipes}

    # Import blueprints and register them
    from app.routes.ingredient import ingredient_bp
    from app.routes.barcode import barcode_bp
    from app.errors.handlers import errors as errors_bp
    from app.routes.login import login_bp
    from app.routes.pantry import pantry_bp
    from app.routes.pantry_entry import pantry_entry_bp
    from app.routes.vision import vision_bp
    from app.routes.recipe import recipe_bp
    from app.routes.reports import reports_bp

    app.register_blueprint(ingredient_bp)
    app.register_blueprint(errors_bp)
    app.register_blueprint(barcode_bp)
    app.register_blueprint(login_bp, url_prefix='/api')
    app.register_blueprint(pantry_bp, url_prefix='/api')
    app.register_blueprint(pantry_entry_bp)
    app.register_blueprint(vision_bp)
    app.register_blueprint(recipe_bp, url_prefix='/api')
    app.register_blueprint(reports_bp, url_prefix='/api')

    return app



from app import routes, models

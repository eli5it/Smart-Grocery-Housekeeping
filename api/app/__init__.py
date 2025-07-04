from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import sqlalchemy as sa
import sqlalchemy.orm as so

# assistance from ChatGPT https://chatgpt.com/share/6865e6ff-26c0-8012-a772-70b7b9de5273

db = SQLAlchemy()
migrate = Migrate() 

def create_app():
    app = Flask(__name__)

    @app.shell_context_processor
    def make_shell_context():
        # DO NOT MOVE imports
        # need to perform imports here to avoid circular dependency issue
        from app.models import Ingredient, User
        return {'sa': sa, 'so': so, 'db': db, 'Ingredient': Ingredient, 'User': User}

    CORS(app)
    app.config.from_object(Config)
     
    # Initialize extensions with this app
    db.init_app(app)
    migrate.init_app(app, db)

    # Import blueprints and register them
    from app.routes.ingredient import ingredient_bp  
    app.register_blueprint(ingredient_bp )

    return app

from app import routes, models
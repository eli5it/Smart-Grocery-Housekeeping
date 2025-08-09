import os
basedir = os.path.abspath(os.path.dirname(__file__))
print(os.environ.get('DATABASE_URL'))

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        f"sqlite:///{os.path.join(basedir, 'app.db')}"
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'my_test_key'

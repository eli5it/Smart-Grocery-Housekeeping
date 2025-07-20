import pytest
from app import create_app, db
from app.models.user import User
from werkzeug.security import generate_password_hash


@pytest.fixture(scope='module')
def test_app():
    app = create_app()
    app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'JWT_SECRET_KEY': 'test_secret'
    })

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(test_app):
    return test_app.test_client()


@pytest.fixture
def test_user(test_app):
    with test_app.app_context():
        user = User.query.filter_by(username='testuser').first()
        if not user:
            user = User(username='testuser',
                        password_hash=generate_password_hash('test'))
            db.session.add(user)
            db.session.commit()
        return db.session.get(User, user.id)
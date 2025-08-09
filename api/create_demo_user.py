#!/usr/bin/env python3
"""
Simple script to create a test user for demo purposes
"""
from app import create_app, db
from app.models import User
from werkzeug.security import generate_password_hash
import sqlalchemy as sa

def create_demo_user():
    app = create_app()
    with app.app_context():
        print("Creating demo user...")
        
        # Check if user already exists
        user = db.session.execute(
            sa.select(User).where(User.username == "test_user")).scalar_one_or_none()
        
        if user is not None:
            print("User 'test_user' already exists!")
            return
        
        # Create new user
        password_hash = generate_password_hash('password')
        user = User(username='test_user', password_hash=password_hash)
        db.session.add(user)
        db.session.commit()
        
        print("✅ Successfully created user: test_user / password")
        print("🎉 You can now login to the app!")

if __name__ == "__main__":
    create_demo_user()

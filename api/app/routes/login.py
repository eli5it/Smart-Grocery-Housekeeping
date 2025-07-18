from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from werkzeug.security import check_password_hash, generate_password_hash
from app.models.user import User
from app.schemas import UserSchema
from app import db


login_bp = Blueprint('login', __name__)

user_schema = UserSchema()


@login_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    if (not user or
            not check_password_hash(user.password_hash, data['password'])):
        return jsonify({"msg": "Invalid Username and/or Password"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": token}), 200


@login_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password_hash=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    token = create_access_token(identity=str(new_user.id))

    return jsonify({
        "msg": "User created successfully",
        "access_token": token
    }), 201


@login_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify(user_schema.dump(user)), 200

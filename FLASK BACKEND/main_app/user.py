from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from email_validator import validate_email, EmailNotValidError
from .database import db_session
from .utils import Queries
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, create_refresh_token
from .models import User, user_schema

user = Blueprint('user', __name__, url_prefix='/user/')


@user.post('register')
def register():
    username = request.json['username']
    email = request.json['email']
    picture = request.json['picture']
    password = request.json['password']
    con_pass = request.json['con_pass']

    another_username = Queries.filter_one(User, User.username, username)
    another_email = Queries.filter_one(User, User.email, email)

    if another_username:
        return jsonify({"message": "Username taken!", "status": False}), 400
    if another_email:
        return jsonify({"message": "Email already exists!", "status": False}), 400
    if len(username) < 5:
        return jsonify({"message": "Username must be at least 5 characters!", "status": False}), 400
    if len(password) < 7:
        return jsonify({"message": "Password must be at least 7 characters!", "status": False}), 400
    if password != con_pass:
        return jsonify({"message": "Passwords don't match!", "status": False}), 400
    if not password.isalnum():
        return jsonify({"message": "Password must be alphanumeric!", "status": False}), 400
    try:
        validate_email(email).email
    except EmailNotValidError:
        return jsonify({"message": "Email is not valid!", "status": False}), 400

    password = generate_password_hash(password)

    new_user = User(username=username, email=email, password=password, picture=picture)

    db_session.add(new_user)
    db_session.commit()

    return jsonify({"message": "User created!", "status": True}), 201


@user.post('login')
def login():
    email = request.json['email']
    password = request.json['password']

    login_user = Queries.filter_one(User, User.email, email)

    if not login_user:
        return jsonify({"message": "Invalid username or password!", "status": False}), 400
    if not check_password_hash(login_user.password, password):
        return jsonify({"message": "Invalid username or password!", "status": False}), 400

    access_token = create_access_token(identity=login_user.id)
    refresh_token = create_refresh_token(identity=login_user.id)

    return jsonify({"message": "Login successful!", "status": True,
                    "access_token": access_token, "refresh_token": refresh_token}), 200


@user.get('get')
@jwt_required()
def get():
    user_id = get_jwt_identity()
    get_user = Queries.filter_one(User, User.id, user_id)

    if not get_user:
        return jsonify({"message": "Invalid user!", "status": False}), 400

    get_user = user_schema.dump(get_user)

    return jsonify({"message": "Get successful!", "status": True, "user": get_user}), 200


@user.put('update')
@jwt_required()
def update():
    username = request.json['username']
    email = request.json['email']
    picture = request.json['picture']

    user_id = get_jwt_identity()
    update_user = Queries.filter_one(User, User.id, user_id)

    another_username = Queries.filter_one(User, User.username, username)
    another_email = Queries.filter_one(User, User.email, email)

    if not update_user:
        return jsonify({"message": "Invalid user!", "status": False}), 400
    if another_username and another_username != update_user:
        return jsonify({"message": "Username taken!", "status": False}), 400
    if another_email and another_email != update_user:
        return jsonify({"message": "Email already exists!", "status": False}), 400

    update_user.username = username
    update_user.email = email
    update_user.picture = picture

    db_session.commit()

    return jsonify({"message": "Update successful!", "status": True}), 200


@user.delete('delete')
@jwt_required()
def delete():
    user_id = get_jwt_identity()
    del_user = Queries.filter_one(User, User.id, user_id)

    if not del_user:
        return jsonify({"message": "Invalid user!", "status": False}), 400

    db_session.delete(del_user)
    db_session.commit()

    return jsonify({"message": "Delete successful!", "status": True}), 200


@user.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify({"access_token": access_token}), 200

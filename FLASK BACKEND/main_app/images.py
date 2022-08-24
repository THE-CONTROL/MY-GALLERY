from flask import Blueprint, request, jsonify
from .database import db_session
from .utils import Queries
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import Image, image_schema, images_schema, User

images = Blueprint('images', __name__, url_prefix='/images/')


@images.post('add')
@jwt_required()
def add():
    link = request.json['link']

    user_id = get_jwt_identity()

    if not link:
        return jsonify({"message": "Invalid image!", "status": False}), 400

    new_image = Image(link=link, user_id=user_id)

    db_session.add(new_image)
    db_session.commit()

    return jsonify({"message": "Image created!", "status": True}), 201


@jwt_required()
@images.get('get/<index>')
def get(index):
    get_image = Queries.filter_one(Image, Image.id, index)

    if not get_image:
        return jsonify({"message": "Invalid image!", "status": False}), 400

    get_image = image_schema.dump(get_image)

    return jsonify({"message": "Get successful!", "status": True, "images": get_image}), 200


@images.get('get/all/<page>')
@jwt_required()
def get_all(page):
    user_id = get_jwt_identity()

    cur_user = Queries.filter_one(User, User.id, user_id)

    if not cur_user:
        return jsonify({"message": "Invalid user!", "status": False}), 400

    get_images = images_schema.dump(cur_user.images)

    get_images = Queries.paginate(page, get_images)

    return jsonify({"message": "Get successful!", "status": True, "images": get_images}), 200


@images.delete('delete/<index>')
@jwt_required()
def delete(index):
    delete_image = Queries.filter_one(Image, Image.id, index)

    if not delete_image:
        return jsonify({"message": "Invalid image!", "status": False}), 400

    db_session.delete(delete_image)
    db_session.commit()

    return jsonify({"message": "Delete successful!", "status": True}), 200

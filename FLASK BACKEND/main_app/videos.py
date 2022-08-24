from flask import Blueprint, request, jsonify
from .database import db_session
from .utils import Queries
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import Video, video_schema, videos_schema, User

videos = Blueprint('videos', __name__, url_prefix='/videos/')


@videos.post('add')
@jwt_required()
def add():
    link = request.json['link']
    name = request.json['name']

    user_id = get_jwt_identity()

    if not link:
        return jsonify({"message": "Invalid video!", "status": False}), 400

    new_video = Video(link=link, user_id=user_id, name=name)

    db_session.add(new_video)
    db_session.commit()

    return jsonify({"message": "Video created!", "status": True}), 201


@videos.get('get/<index>')
@jwt_required()
def get(index):
    get_video = Queries.filter_one(Video, Video.id, index)

    if not get_video:
        return jsonify({"message": "Invalid video!", "status": False}), 400

    get_video = video_schema.dump(get_video)

    return jsonify({"message": "Get successful!", "status": True, "videos": get_video}), 200


@videos.get('get/all/<page>')
@jwt_required()
def get_all(page):
    user_id = get_jwt_identity()

    cur_user = Queries.filter_one(User, User.id, user_id)

    if not cur_user:
        return jsonify({"message": "Invalid user!", "status": False}), 400

    get_videos = videos_schema.dump(cur_user.videos)

    get_videos = Queries.paginate(page, get_videos)

    return jsonify({"message": "Get successful!", "status": True, "videos": get_videos}), 200


@videos.delete('delete/<index>')
@jwt_required()
def delete(index):
    delete_video = Queries.filter_one(Video, Video.id, index)

    if not delete_video:
        return jsonify({"message": "Invalid video!", "status": False}), 400

    db_session.delete(delete_video)
    db_session.commit()

    return jsonify({"message": "Delete successful!", "status": True}), 200

from flask import Blueprint, request, jsonify
from .database import db_session
from .utils import Queries
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import Audio, audio_schema, audios_schema, User

audios = Blueprint('audios', __name__, url_prefix='/audios/')


@audios.post('add')
@jwt_required()
def add():
    link = request.json['link']
    name = request.json['name']

    user_id = get_jwt_identity()

    if not link:
        return jsonify({"message": "Invalid audio!", "status": False}), 400

    new_audio = Audio(link=link, user_id=user_id, name=name)

    db_session.add(new_audio)
    db_session.commit()

    return jsonify({"message": "Audio created!", "status": True}), 201


@audios.get('get/<index>')
@jwt_required()
def get(index):
    get_audio = Queries.filter_one(Audio, Audio.id, index)

    if not get_audio:
        return jsonify({"message": "Invalid audio!", "status": False}), 400

    get_audio = audio_schema.dump(get_audio)

    return jsonify({"message": "Get successful!", "status": True, "audios": get_audio}), 200


@audios.get('get/all/<page>')
@jwt_required()
def get_all(page):
    user_id = get_jwt_identity()

    cur_user = Queries.filter_one(User, User.id, user_id)

    if not cur_user:
        return jsonify({"message": "Invalid user!", "status": False}), 400

    get_audios = audios_schema.dump(cur_user.audios)

    get_audios = Queries.paginate(int(page), get_audios)

    return jsonify({"message": "Get successful!", "status": True, "audios": get_audios}), 200


@audios.delete('delete/<index>')
@jwt_required()
def delete(index):
    delete_audio = Queries.filter_one(Audio, Audio.id, index)

    if not delete_audio:
        return jsonify({"message": "Invalid audio!", "status": False}), 400

    db_session.delete(delete_audio)
    db_session.commit()

    return jsonify({"message": "Delete successful!", "status": True}), 200

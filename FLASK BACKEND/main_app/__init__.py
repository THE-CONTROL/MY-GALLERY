import os
from flask import Flask
from .database import db_session, init_db
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='UNKNOWN',
        DATABASE=os.path.join(app.instance_path, 'main_app.sqlite'),
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(minutes=1),
        JWT_REFRESH_TOKEN_EXPIRES=timedelta(days=900)
    )
    JWTManager(app)
    CORS(app)

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import user, images, audios, videos

    app.register_blueprint(user.user)
    app.register_blueprint(images.images)
    app.register_blueprint(audios.audios)
    app.register_blueprint(videos.videos)

    init_db()

    return app


app = create_app()

if __name__ == "__main__":
    app.run()

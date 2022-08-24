from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from .database import Base
from datetime import datetime
from flask_marshmallow import Marshmallow
from sqlalchemy.orm import relationship

ma = Marshmallow()


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    email = Column(String(120), unique=True)
    picture = Column(Text)
    password = Column(Text)
    images = relationship("Image", back_populates="user", cascade="all, delete, delete-orphan")
    audios = relationship("Audio", back_populates="user", cascade="all, delete, delete-orphan")
    videos = relationship("Video", back_populates="user", cascade="all, delete, delete-orphan")
    date_created = Column(DateTime, default=datetime.now())

    def __init__(self, username, email, password, picture):
        self.username = username
        self.email = email
        self.password = password
        self.picture = picture

    def __repr__(self):
        return f'<User {self.username!r}>'


class UserSchema(ma.Schema):
    class Meta:
        fields = ("id", "username", "email", "picture", "password", "date_created")


user_schema = UserSchema()
users_schema = UserSchema(many=True)


class Image(Base):
    __tablename__ = 'images'
    id = Column(Integer, primary_key=True)
    link = Column(String(50))
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="images")
    date_created = Column(DateTime, default=datetime.now())

    def __init__(self, link, user_id):
        self.link = link
        self.user_id = user_id

    def __repr__(self):
        return f'<Image {self.link!r}>'


class ImageSchema(ma.Schema):
    class Meta:
        fields = ("id", "link", "date_created")


image_schema = ImageSchema()
images_schema = ImageSchema(many=True)


class Audio(Base):
    __tablename__ = 'audios'
    id = Column(Integer, primary_key=True)
    link = Column(String(50))
    name = Column(String(200))
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="audios")
    date_created = Column(DateTime, default=datetime.now())

    def __init__(self, link, user_id, name):
        self.link = link
        self.user_id = user_id
        self.name = name

    def __repr__(self):
        return f'<Audio {self.name!r}>'


class AudioSchema(ma.Schema):
    class Meta:
        fields = ("id", "link", "name", "date_created")


audio_schema = AudioSchema()
audios_schema = AudioSchema(many=True)


class Video(Base):
    __tablename__ = 'videos'
    id = Column(Integer, primary_key=True)
    link = Column(String(50))
    name = Column(String(200))
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="videos")
    date_created = Column(DateTime, default=datetime.now())

    def __init__(self, link, user_id, name):
        self.link = link
        self.user_id = user_id
        self.name = name

    def __repr__(self):
        return f'<Video {self.name!r}>'


class VideoSchema(ma.Schema):
    class Meta:
        fields = ("id", "link", "name", "date_created")


video_schema = VideoSchema()
videos_schema = VideoSchema(many=True)


class Random(Base):
    __tablename__ = 'randoms'
    id = Column(Integer, primary_key=True)
    value = Column(String(50), unique=True)
    user_email = Column(String(120))
    date_created = Column(DateTime, default=datetime.now())

    def __init__(self, value, user_email):
        self.value = value
        self.user_email = user_email

    def __repr__(self):
        return f'<Random {self.value!r}>'

from flask_sqlalchemy import SQLAlchemy
from flask_restx import Api
from flask_jwt_extended import JWTManager
from flask import Blueprint

authorizations = {
    'Bearer Auth': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': "Entrez 'Bearer <votre_jwt>'"
    }
}
api_bp = Blueprint('api', __name__)
api = Api(
    api_bp,
    # doc='/api/docs',
    title='Hikari server API',
    version='1.0',
    description='API for managing home devices remotely',
    authorizations=authorizations,
    security='Bearer Auth'
)
db = SQLAlchemy()
jwt = JWTManager()

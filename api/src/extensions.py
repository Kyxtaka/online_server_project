from flask_sqlalchemy import SQLAlchemy
from flask_restx import Api
from flask_jwt_extended import JWTManager

authorizations = {
    'Bearer Auth': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': "Entrez 'Bearer <votre_jwt>'"
    }
}

api = Api(
    title='Hikari server API',
    version='1.0',
    description='API for managing home automation devices',
    authorizations=authorizations,
    security='Bearer Auth'
)
db = SQLAlchemy()
jwt = JWTManager()

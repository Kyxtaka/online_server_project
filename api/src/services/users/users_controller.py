from flask import request
from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.model.datamodel.entityModel import user_model, user_input_model
from src.model.datamodel.entityORM import UsersCRUD, Users
from src.extensions import api
from flask_jwt_extended import jwt_required, get_jwt_identity, get_csrf_tokem, get_jwt
from flask_restx import Namespace, Resource, fields
from src.extensions import api
from src.model.datamodel.entityORM import Computers, Users, UserComputerRights, ComputersCRUD, UsersCRUD, UserComputerRightsCRUD, AppRoleList, OSList, StatusList

from src.model.datamodel.entityModel import (
    computer_model,
    computer_input_model,
    user_model,
    user_input_model,
    usercomputer_access_model,
    usercomputer_access_input_model
)


from flask import request
from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.model.datamodel.entityModel import user_model, user_input_model
from src.model.datamodel.entityORM import UsersCRUD, Users
from src.extensions import api
from src.model.datamodel.entityORM import AppRoleList, AccessList, OSList

def check_role(role: str, var_list: list) -> bool:
    success = False
    try:
        set_var = var_list(role.upper())
        success = True
        print(f"check_role {set_var}")
        print(f"check success")
    except ValueError as e:
        success = False
        print("check failed")
        raise ValueError(e)
    return success

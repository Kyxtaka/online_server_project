from flask import Blueprint, request, jsonify
from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.model.datamodel.entityModel import user_model
from src.model.datamodel.entityORM import Users, AppRoleList, UsersCRUD
from src.model.auth.auth_decorators import admin_required
from src.services.admin.admin_controller import *
from src.services.auth.auth_controller import get_user, is_allowed
from src.app import api_version_path


admin_ns = Namespace("admin", description="Admin routes", path=api_version_path + "/admin")

@admin_ns.route("/users")
class UserCollection(Resource):
    @jwt_required()
    @admin_required
    
    @admin_ns.marshal_list_with(user_model, code=200, description="List of users")
    def get(self):
        current_user = get_user(get_jwt_identity())
        if is_allowed(current_user, AppRoleList.ADMIN) is False:
            return {"message": "Access forbidden: Admins only"}, 403
        return Users.query.all()
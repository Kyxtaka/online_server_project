from flask_restx import Resource, Namespace, fields
from src.model.datamodel.entityModel import user_model, user_input_model, usercomputer_access_model, usercomputer_access_input_model, user_edit_model, user_change_password_model
from src.model.datamodel.entityORM import Users, UsersCRUD, AppRoleList
from src.extensions import api
from src.app import api_version_path
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from src.model.auth.auth_decorators import admin_required
from src.services.users.users_controller import check_role

user_ns:Namespace = Namespace("user", description="User management API", path=api_version_path + "/user", decorators=[api.doc(security='BearerAuth')])

@user_ns.route("")
class UserCollection(Resource):
    @user_ns.expect(user_input_model)
    @user_ns.marshal_with(user_model)
    @admin_required
    def post(self):
        try: 
            check_role(user_ns.payload['role'], AppRoleList)
        except ValueError as e:
            return {"msg": "Bad request - "+e}, 400
        print("Creating a new user with payload:", user_ns.payload)
        if 'password' not in user_ns.payload:
            return {"msg": "Password is required"}, 400
        user = UsersCRUD.create(
            username=user_ns.payload['username'].lower(),
            email=user_ns.payload['email'].lower(),
            role=user_ns.payload['role'].upper(),
            password=user_ns.payload['password']
        )
        return user, 201
    
    @jwt_required()
    @user_ns.marshal_with(user_model)
    def get(self):
        user = UsersCRUD.get_by_email(get_jwt_identity())
        return user
    
@user_ns.route("/<int:id>")
class UserItem(Resource):
    @jwt_required()
    @user_ns.expect(user_edit_model)
    @user_ns.marshal_with(user_model)
    def put(self, id):
        try: 
            check_role(user_ns.payload['role'], AppRoleList)
        except ValueError as e:
            return {"msg": "Bad request - "+e}, 400
        match UsersCRUD.get_by_email(get_jwt_identity()).role: 
            case AppRoleList.ADMIN:
                user = UsersCRUD.update(
                    id, username=user_ns.payload['username'].lower(),
                    email=user_ns.payload['email'].lower(),
                    role=user_ns.payload['role'].upper(),
                    password=user_ns.payload['password']
                )
            case AppRoleList.USER:
                current_user = UsersCRUD.get_by_email(get_jwt_identity())
                if current_user.id != id:
                    return {"msg": "You can only update your own user information"}, 403
                user = UsersCRUD.update(
                    id, username=user_ns.payload['username'].lower(),
                    email=user_ns.payload['email'].lower(),
                    role=current_user.role,  # User cannot change their own role
                    password=user_ns.payload['password']
                )
            case None:
                return {"msg": "Unauthorized"}, 401
        return user, 200
    
    @jwt_required()
    @admin_required
    @user_ns.response(204, "User deleted")
    def delete(self, id):
        is_deleted = False
        is_deleted = UsersCRUD.delete(id)
        if is_deleted:
            return {"msg": "User deleted successfully"}, 204
        else:   
            return {"msg": "User not found"}, 404
    
@user_ns.route("/<int:id>/changePassword")
class UserChangePassword(Resource):
    @jwt_required()
    @user_ns.expect(user_change_password_model)
    def put(self, id):
        current_user = UsersCRUD.get_by_email(get_jwt_identity())
        if current_user.id != id:
            return {"msg": "You can only change your own password"}, 403
        if 'newPassword' not in user_ns.payload:
            return {"msg": "New password is required"}, 400
        if 'currentPassword' not in user_ns.payload:
            return {"msg": "Current password is required"}, 400
        if not UsersCRUD.verify_password(current_user, user_ns.payload['currentPassword']):
            return {"msg": "Current password is incorrect"}, 400
        user = UsersCRUD.update(
            id, password=user_ns.payload['newPassword']
        )
        return {"msg": "Password changed successfully"}, 200
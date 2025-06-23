from flask_restx import Resource, Namespace, fields
from src.model.datamodel.entityModel import user_model, user_input_model, usercomputer_access_model, usercomputer_access_input_model
from src.model.datamodel.entityORM import Users, UserComputerRights, Computers, UsersCRUD, AppRoleList
from src.extensions import api
from src.app import api_version_path
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from src.model.auth.auth_decorators import admin_required

user_ns:Namespace = Namespace("users", description="User management API", path=api_version_path + "/users", decorators=[api.doc(security='BearerAuth')])

@user_ns.route("")
class UserCollection(Resource):
    @user_ns.expect(user_input_model)
    @user_ns.marshal_with(user_model)
    def post(self):
        print("Creating a new user with payload:", user_ns.payload)
        if 'password' not in user_ns.payload:
            return {"msg": "Password is required"}, 400
        user = UsersCRUD.create(
            username=user_ns.payload['username'],
            email=user_ns.payload['email'],
            role=user_ns.payload['role'],
            password=user_ns.payload['password']
        )
        return user, 201
    
@user_ns.route("/<int:id>")
class UserItem(Resource):
    @jwt_required()
    @user_ns.marshal_with(user_model)
    def get(self, id):
        user = Users.query.get_or_404(id)
        return user
    
    @jwt_required()
    @user_ns.expect(user_input_model)
    @user_ns.marshal_with(user_model)
    def put(self, id):
        match UsersCRUD.get_by_email(get_jwt_identity()).role: 
            case AppRoleList.ADMIN:
                user = UsersCRUD.update(
                    id, username=user_ns.payload['username'],
                    email=user_ns.payload['email'],
                    role=user_ns.payload['role'],
                    password=user_ns.payload['password']
                )
            case AppRoleList.USER:
                current_user = UsersCRUD.get_by_email(get_jwt_identity())
                if current_user.id != id:
                    return {"msg": "You can only update your own user information"}, 403
                user = UsersCRUD.update(
                    id, username=user_ns.payload['username'],
                    email=user_ns.payload['email'],
                    role=current_user.role,  # User cannot change their own role
                    password=user_ns.payload['password']
                )
            case None:
                return {"msg": "Unauthorized"}, 401
        return user, 200
    
   
        
from flask_restx import Resource, Namespace, fields
from ..model.entityModel import user_model, user_input_model, usercomputer_access_model, usercomputer_access_input_model
from ..model.entityORM import Users, UserComputerRights, Computers, UsersCRUD
from ..extensions import db

user_ns:Namespace = Namespace("users", description="User management API")

@user_ns.route("/users")
class UserCollection(Resource):
    
    @user_ns.marshal_list_with(user_model)
    def get(self):
        return Users.query.all()
    
    @user_ns.expect(user_input_model)
    @user_ns.marshal_with(user_model)
    def post(self):
        print("Creating a new user with payload:", user_ns.payload)
        if 'password' not in user_ns.payload:
            return {"message": "Password is required"}, 400
        user = UsersCRUD.create(
            username=user_ns.payload['username'],
            email=user_ns.payload['email'],
            role=user_ns.payload['role'],
            password=user_ns.payload['password']
        )
        return user, 201
    
@user_ns.route("/users/<int:id>")
class UserItem(Resource):
    
    @user_ns.marshal_with(user_model)
    def get(self, id):
        user = Users.query.get_or_404(id)
        return user
    
    @user_ns.expect(user_input_model)
    @user_ns.marshal_with(user_model)
    def put(self, id):
        user = UsersCRUD.update(
            id, username=user_ns.payload['username'],
            email=user_ns.payload['email'],
            role=user_ns.payload['role'],
            password=user_ns.payload['password']
        ) 
        return user
    
    @user_ns.response(204, "User deleted")
    def delete(self, id):
        is_deleted = False
        is_deleted = UsersCRUD.delete(id)
        if is_deleted:
            return {"message": "User deleted successfully"}, 204
        else:   
            return {"message": "User not found"}, 404
        # return {"message": "Delete functionality not implemented yet"}, 501 

   
        
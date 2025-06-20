from flask_restx import Resource, Namespace, fields
from ..model.entityModel import user_model, user_input_model, usercomputer_access_model, usercomputer_access_input_model
from ..model.entityORM import Users, UserComputerRights, Computers

user_ns = Namespace("users", description="User management API")

@user_ns.route("/users")
class UserCollection(Resource):
    
    @user_ns.marshal_list_with(user_model)
    def get(self):
        return Users.query.all()
    
@user_ns.route("/users/<int:id>")
class UserItem(Resource):
    
    @user_ns.marshal_with(user_model)
    def get(self, id):
        user = Users.query.get_or_404(id)
        return user
    
    @user_ns.expect(user_input_model)
    @user_ns.marshal_with(user_model)
    def put(self, id):
        # user = Users.query.get_or_404(id)
        # user.update_from_dict(user_input_model.parse_args())
        return {"message": "Update functionality not implemented yet"}, 501
    
    @user_ns.response(204, "User deleted")
    def delete(self, id):
        # user = Users.query.get_or_404(id)
        # user.delete()
        return {"message": "Delete functionality not implemented yet"}, 501
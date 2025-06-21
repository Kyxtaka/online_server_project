from flask import request
from flask_restx import Namespace, Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from src.model.auth.authmodel import auth_input_model, auth_output_model
from src.extensions import api

auth_ns = Namespace("auth", description="Authentication routes")

@auth_ns.route("/login")
class Login(Resource):
    @auth_ns.expect(auth_input_model)
    def post(self):
        username = auth_ns.payload["username"]
        password = auth_ns.payload["password"]
        if not username:
            return {"msg": "Username is required"}, 400
        elif not password:
            return {"msg": "Password is required"}, 400
        if username == "admin" and password == "secret":
            token = create_access_token(identity=username)
            return {"access_token": token}, 200
        return {"msg": "Bad credentials"}, 401
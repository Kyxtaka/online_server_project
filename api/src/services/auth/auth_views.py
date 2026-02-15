from flask import request
from flask_restx import Namespace, Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from src.model.auth.auth_model import auth_input_model, auth_output_model
from src.extensions import api
from src.services.auth.auth_controller import *
auth_ns = Namespace("auth", description="Authentication routes", path="/auth")

@auth_ns.route("/login")
class Login(Resource):
    @auth_ns.expect(auth_input_model)
    def post(self):
        username = auth_ns.payload["username"]
        password = auth_ns.payload["password"]
        if not username: return {"message": "Username is required"}, 400
        elif not password: return {"message": "Password is required"}, 400
        try:
            token = authenticate(username, password)
            if token is not None: return {"access_token": token}, 200
            return {"message": "Bad credentials"}, 401
        except Exception as e:
            return {"message": str(e)}, 401

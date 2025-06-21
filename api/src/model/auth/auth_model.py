from src.extensions import api
from flask_restx import fields

auth_input_model = api.model("Auth Input Model", {
    "username": fields.String(required=True, description="Username of the user"),
    "password": fields.String(required=True, description="Password of the user")
})

auth_output_model = api.model("Auth Output Model", {
    "access_token": fields.String(required=True, description="JWT access token for the user")
})

auth_jwt_accesstoken_input_model = api.model("Auth JWT Access Token Input Model", {
    "access_token": fields.String(required=True, description="JWT access token for the user")
})
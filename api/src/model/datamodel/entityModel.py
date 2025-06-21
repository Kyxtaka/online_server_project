from flask_restx import fields, Model
from src.extensions import api

computer_model = api.model("ComputerDTO", {
    "macAddress": fields.String(required=True, description="MAC address of the computer"),
    "localV4IpAddress": fields.String(required=True, description="Local IPv4 address of the computer"),
    "v6IpAddress": fields.String(required=True, description="IPv6 address of the computer"),
    "name": fields.String(required=True, description="Name of the computer"),
    "hostname": fields.String(required=True, description="Hostname of the computer"),
    "os": fields.String(required=True, description="Operating system of the computer"),
    "status": fields.String(required=True, description="Status of the computer (e.g., online, offline)"),
    "lastseen": fields.DateTime(required=True, description="Last seen timestamp of the computer")
})

computer_input_model = api.model("ComputerInputDTO", {
    "macAddress": fields.String(required=True, description="MAC address of the computer"),
    "localV4IpAddress": fields.String(required=True, description="Local IPv4 address of the computer"),
    "v6IpAddress": fields.String(required=True, description="IPv6 address of the computer"),
    "name": fields.String(required=True, description="Name of the computer"),
    "hostname": fields.String(required=True, description="Hostname of the computer"),
    "os": fields.String(required=True, description="Operating system of the computer"),
    "status": fields.String(required=True, description="Status of the computer (e.g., online, offline)")
})


user_model = api.model("UserDTO", {
    "id": fields.Integer(readOnly=True, description="Unique identifier of the user"),
    "username": fields.String(required=True, description="Username of the user"),
    "email": fields.String(required=True, description="Email address of the user"),
    "role": fields.String(required=True, description="Role of the user (e.g., ADMIN, FRIENDS, GUEST)"),
    "createdAt": fields.DateTime(readOnly=True, description="Timestamp when the user was created")
})

user_input_model = api.model("UserInputDTO", {
    "username": fields.String(required=True, description="Username of the user"),
    "email": fields.String(required=True, description="Email address of the user"),
    "role": fields.String(required=True, description="Role of the user (e.g.,ADMIN, FRIENDS, GUEST)"),
    "password": fields.String(required=True, description="Password of the user")
})

usercomputer_access_model = api.model("UserComputerAccessDTO", {
    "email": fields.String(required=True, description="Email address of the user"),
    "macAddress": fields.String(required=True, description="MAC address of the computer"),
    "systemAuthorityLevel": fields.String(required=True, description="System authority level of the user (e.g., ADMIN, FRIENDS, GUEST)")
})

usercomputer_access_input_model = api.model("UserComputerAccessInputDTO", {
    "email": fields.String(required=True, description="Email address of the user"),
    "macAddress": fields.String(required=True, description="MAC address of the computer"),
    "systemAuthorityLevel": fields.String(required=True, description="System authority level of the user (e.g., ADMIN, FRIENDS, GUEST)")
})
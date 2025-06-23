from flask import request
from flask_restx import Namespace, Resource
from src.extensions import api
from src.model.datamodel.entityORM import Users, Computers, UserComputerRights
from src.model.datamodel.entityModel import (
    computer_model,
    computer_input_model,
    user_model,
    user_input_model,
    usercomputer_access_model,
    usercomputer_access_input_model
)
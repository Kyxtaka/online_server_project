from flask import Blueprint, request, jsonify
from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
# from src.model.admin.admin_model import admin_input_model, admin_output_model
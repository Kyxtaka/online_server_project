from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from src.model.datamodel.entityORM import Users, UsersCRUD, AppRoleList
from datetime import timedelta
import re 
from flask import request

def authenticate(username, password) -> str:
    """
    to complete
    """
    user: Users = None
    if not username or not password: return None
    # Check if the username is an email or a username
    if is_email(username): user = UsersCRUD.get_by_email(username)
    else: user = Users.query.filter_by(username=username).first()
    if not check_password_hash(user.password, password): return None  # Incorrect password
    print(f"User authenticated: {user.email} with role {user.role.get_role()}")
    access_token = create_access_token(identity=user.email, additional_claims={"role": user.role.get_role(), "remote_ip": request.remote_addr}, expires_delta=timedelta(hours=1))
    return access_token


def is_email(string:str) -> bool:
    """
    Check if the given string is a valid email address.
    """
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, string) is not None    

def get_user(email: str) -> Users:
    """
    Get the user from the JWT token.
    """
    user = UsersCRUD.get_by_email(email)
    if not user: return None
    return user

def is_allowed(user: Users, role: AppRoleList)-> bool:
    """
    Check if the user has the required role.
    """
    if not user: return False
    return user.role == role
from flask_jwt_extended import verify_jwt_in_request, get_jwt, get_jwt_identity
from src.model.datamodel.entityORM import AppRoleList, Users, UsersCRUD
from functools import wraps
from flask import request

# Decorators for role-based access control in Flask with JWT
def role_required(role):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            print(f"Checking role: {role}")
            print(f"Current claims: {get_jwt()}")
            print(f"remote address: {request.remote_addr}")
            current_user: Users = UsersCRUD.get_by_email(get_jwt_identity())
            if current_user.role != role:
                return {"message": f"Access forbidden: {role.get_role()} only"}, 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

# Decorators for specific roles
def admin_required(fn):
    return role_required(AppRoleList.ADMIN)(fn)

def user_required(fn):
    return role_required(AppRoleList.USER)(fn)

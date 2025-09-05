from flask import request
from flask_restx import Namespace, Resource, reqparse
from src.extensions import api
from src.app import api_version_path
from src.model.datamodel.entityORM import Users, Computers, UserComputerRights, ComputersCRUD, UsersCRUD, UserComputerRightsCRUD, AppRoleList, OSList, StatusList
from src.model.datamodel.entityORM import AppRoleList, AccessList
from src.model.datamodel.entityModel import  computer_model, computer_input_model, user_model, user_input_model, usercomputer_access_model, usercomputer_access_input_model
from src.model.auth.auth_decorators import admin_required
from flask_jwt_extended import jwt_manager, jwt_required, get_jwt_identity
from src.services.auth.auth_views import is_allowed



computer_ns  = Namespace('computers', description='Computers related operations', path=api_version_path+'/computers')
computer_rights_ns  = Namespace('computer rights', description='Computers rights related operations', path=api_version_path+"/computers/<string:computer_mac>/rights")
# computer_rights_resourece_ns = Namespace('Computer rights resource', description='computer rights resource', path=api_version_path+"/computers/rights")

@computer_ns.route('')
class ComputerCollection(Resource):
    @jwt_required()
    @computer_ns.marshal_list_with(computer_model)
    def get(self):
        """Get all computers"""
        return ComputersCRUD.get_all_computers()

    @admin_required
    @computer_ns.expect(computer_input_model)
    @computer_ns.marshal_with(computer_model, code=201)
    def post(self):
        """Create a new computer"""
        data = request.json
        return ComputersCRUD.create(
            macAddress = data['macAddress'],
            localV4IpAddress = data['localV4IpAddress'],
            v6IpAddress = data['v6IpAddress'],
            name = data['name'],
            hostname = data['hostname'],
            os = data['os'],
            status = data['status']
        ), 201

@computer_ns.route('/<string:computer_mac>')
class ComputerItem(Resource):
    @computer_ns.marshal_with(computer_model)
    def get(self, computer_mac):
        """Get a computer by MAC address"""
        return ComputersCRUD.get_by_mac(computer_mac)

    @computer_ns.expect(computer_input_model)
    @computer_ns.marshal_with(computer_model)
    @admin_required
    def put(self, computer_mac):
        """Update a computer by MAC address"""
        data = request.json
        return ComputersCRUD.update(computer_mac, data)

    @computer_ns.response(204, 'Computer deleted')
    @admin_required
    def delete(self, computer_mac):
        """Delete a computer by MAC address"""
        ComputersCRUD.delete(computer_mac)
        return '', 204



computer_search_parser = reqparse.RequestParser()
computer_search_parser.add_argument("search", type=str, required=False, help="Search query for computer name or MAC or desc", location='args')
        
grant_parser = reqparse.RequestParser()
grant_parser.add_argument("email", type=str, required=False, help="Email of the user to grant access", location='args')
grant_parser.add_argument("access_level", type=str, choices=["ADMIN", "FRIENDS", "GUEST"], required=True, help="Access level to grant", location='json')

revoke_parser = reqparse.RequestParser()
revoke_parser.add_argument("email", type="str", required=True, help="Account email address", location="arg")

@computer_rights_ns.route("")
class ComputerRights(Resource):
    @jwt_required()
    @computer_rights_ns.expect(grant_parser)
    @admin_required
    def post(self, computer_mac):
        data = request.get_json()
        args = request.args
        email = args.get("email")
        select_authority_level = data.get("access_level")
        if not select_authority_level:
            return {"msg": "access_level is required"}, 400
        try:
            select_authority_level_enum = AccessList(select_authority_level.upper())
        except ValueError:
            return {"msg": "Bad request, access_level must be one of ADMIN, FRIENDS, GUEST"}, 400
        current_user = UsersCRUD.get_by_email(email)
        match current_user:
            case None:
                return {"msg": "user not found"}, 404
            case _:
                currentUserRights = UserComputerRightsCRUD.get_by_email_and_mac(email, computer_mac)
                if currentUserRights is None:
                    UserComputerRightsCRUD.create(
                        email=email,
                        macAddress=computer_mac,
                        systemAuthorityLevel=select_authority_level_enum
                    )   
                else:
                    if currentUserRights.systemAuthorityLevel == select_authority_level_enum:
                        return {"msg": "user already has this privilege"}, 500 
                    
        return  {"msg": "User privileges created with success"}, 201  
    
    @jwt_required()
    @computer_rights_ns.expect(grant_parser)
    @admin_required
    def put(self, computer_mac):
        data = request.get_json()
        args = request.args
        email = args.get("email")
        select_authority_level = data.get("access_level")
        if not select_authority_level:
            return {"msg": "access_level is required"}, 400
        try:
            select_authority_level_enum = AccessList(select_authority_level.upper())
        except ValueError:
            return {"msg": "Bad request, access_level must be one of ADMIN, FRIENDS, GUEST"}, 400
        current_user = UsersCRUD.get_by_email(email)
        match current_user:
            case None:
                return {"msg": "user not found"}, 404
            case _:
                currentUserRights = UserComputerRightsCRUD.get_by_email_and_mac(email, computer_mac)
                if currentUserRights.systemAuthorityLevel == select_authority_level_enum:
                    return {"msg": "user already has this privilege"}, 500
                else: 
                    UserComputerRightsCRUD.update(
                        email=email,
                        macAddress=computer_mac,
                        systemAuthorityLevel=select_authority_level_enum
                    )   
        return  {"msg": "User privileges updated with success"}, 200   
    
    @admin_required
    @computer_rights_ns.expect(revoke_parser)
    def delete(self, computer_mac):
        args = request.args
        email = args.get("email")
        if ComputersCRUD.get_by_mac(computer_mac) == None: return {"msg": "PC not found"}, 404
        if UsersCRUD.get_by_email(email) == None: return {"msg": "user not found"}, 404
        success = UserComputerRightsCRUD.delete(email=email, macAddress=computer_mac)
        if success:
            return {"msg": "operation secceded"}, 204
        else: 
            return {"msg": "error, deletion failed"}, 500
     
    @jwt_required()
    @computer_rights_ns.marshal_list_with(usercomputer_access_model)
    def get(self, computer_mac):
        current_user = UsersCRUD.get_by_email(get_jwt_identity())
        selected_computer = ComputersCRUD.get_by_mac(str.upper(computer_mac))
        if selected_computer is None: return {"msg": "PC not found"}, 404
        if not is_allowed(current_user, AppRoleList.ADMIN):
            potential_right_link = UserComputerRightsCRUD.get_by_email_and_mac(current_user.email, selected_computer.macAddress)
            return potential_right_link if potential_right_link is not None else {"msg": "You do not have any rights for this pc"}
        else: 
            return UserComputerRightsCRUD.get_all_rights_by_mac(selected_computer.macAddress)
    



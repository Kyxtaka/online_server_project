from flask import request
from flask_restx import Namespace, Resource, reqparse
from src.extensions import api
from src.app import api_version_path
from src.model.datamodel.entityORM import Users, Computers, UserComputerRights, ComputersCRUD, UsersCRUD, UserComputerRightsCRUD, AppRoleList, OSList, StatusList
from src.model.datamodel.entityORM import AppRoleList, AccessList
from src.model.datamodel.entityModel import  computer_model, computer_input_model, user_model, user_input_model, usercomputer_access_model, usercomputer_access_input_model
from src.model.auth.auth_decorators import admin_required
from flask_jwt_extended import jwt_manager, jwt_required



computer_ns  = Namespace('computers', description='Computers related operations', path=api_version_path+'/computers')
computer_rights_ns  = Namespace('computer rights', description='Computers rights related operations', path=api_version_path+"/computers/<string:computer_mac>/rights")
computer_rights_resourece_ns = Namespace('Computer rights resource', description='computer rights resource', path=api_version_path+"/computers/rights")

@computer_ns.route('')
class ComputerCollection(Resource):
    @computer_ns.marshal_list_with(computer_model)
    def get(self):
        """Get all computers"""
        return ComputersCRUD.get_all_computers()

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
grant_parser.add_argument("access_level", type=str, required=False, help="Access level to grant", location='args')

revoke_parser = reqparse.RequestParser()
revoke_parser.add_argument("email", type="str", required=True, help="Account email address", location="args")

@computer_rights_ns.route("")
class ComputerRights(Resource):
    @computer_ns.marshal_list_with(usercomputer_access_input_model)
    # @computer_ns.expect(grant_parser)
    @admin_required
    def post(self, computer_mac):
        args = grant_parser.parse_args()
        email = args['email']
        systemAuthorityLevel = args['access_level']
        print(f"query args : email = {args['email']}, access_level = {args['access_level']}")

        if not args['email'] or not args['access_level']: return {"msg": "Email and system authority level are required"}, 400
        # if not args['email'] and args['query'] == 'revoke': return {"msg": "Email and system authority level are required"}, 400
        currentUserRights = UserComputerRightsCRUD.get_by_email_and_mac(email, computer_mac)
        user = UsersCRUD.get_by_email(email)    
        if not user : return {"msg": "User not found"}, 404

        if currentUserRights is None:
            return UserComputerRightsCRUD.create(
                email=email,
                macAddress=computer_mac,
                systemAuthorityLevel=systemAuthorityLevel
            ), 201
        elif currentUserRights.systemAuthorityLevel == AccessList(systemAuthorityLevel): 
            print("EXECUTED")
            return {"msg": "User already has this type of rights for this computer"}, 400
        return {"msg": f"An error occured"}, 500
    
    @admin_required
    def put(self, computer_mac):
        # TODO
        return  {"msg": "not implemented"}, 300   
    
    @admin_required
    @computer_rights_resourece_ns.expect(revoke_parser)
    def delete(self, computer_map):
        # TODO
        return {"msg": "not implemented"}, 300   
     
    @jwt_required()
    def get(self, computer_mac):
        # TODO
        return {"msg": "not implemented"}, 300


# @computer_rights_resourece_ns.route("")
# class ComputerRightsResource(Resource):
#     @computer_ns.expect(usercomputer_access_input_model)
#     @computer_ns.marshal_with(usercomputer_access_model, code=201)
#     @admin_required
#     def post(self, computer_mac):
#         """Assign user rights to a specific computer"""
#         data = computer_ns.payload
#         if 'email' not in data or 'systemAuthorityLevel' not in data:
#             return {"msg": "Email and access level are required"}, 400
#         return UserComputerRightsCRUD.create(
#             email=data['email'],
#             macAddress=computer_mac,
#             systemAuthorityLevel=data['systemAuthorityLevel']
#         ), 201
    
#     def delete(self):
#         return {"msg": "not implemented"}, 300    
    



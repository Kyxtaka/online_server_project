from flask import request
from flask_restx import Namespace, Resource, reqparse
from src.extensions import api
from src.app import api_version_path
from src.model.datamodel.entityORM import Users, Computers, UserComputerRights, ComputersCRUD, UsersCRUD, UserComputerRightsCRUD, AppRoleList, OSList, StatusList
from src.model.datamodel.entityORM import AppRoleList
from src.model.datamodel.entityModel import  computer_model, computer_input_model, user_model, user_input_model, usercomputer_access_model, usercomputer_access_input_model



computer_ns  = Namespace('computers', description='Computers related operations', path=api_version_path+'/computers')

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
    def put(self, computer_mac):
        """Update a computer by MAC address"""
        data = request.json
        return ComputersCRUD.update(computer_mac, data)

    @computer_ns.response(204, 'Computer deleted')
    def delete(self, computer_mac):
        """Delete a computer by MAC address"""
        ComputersCRUD.delete(computer_mac)
        return '', 204



computer_search_parser = reqparse.RequestParser()
computer_search_parser.add_argument("search", type=str, required=False, help="Search query for computer name or MAC or desc", location='args')
    
@computer_ns.route("/search")
class ComputerSearch(Resource):
    @computer_ns.expect(computer_search_parser)
    @computer_ns.marshal_list_with(computer_model)
    def get(self):
        """Search computers by name or MAC address"""
        args = computer_search_parser.parse_args()
        return {"msg" : "Not implemented yet"}, 501
    
grant_parser = reqparse.RequestParser()
grant_parser.add_argument("email", type=str, required=True, help="Email of the user to grant access", location='json')
grant_parser.add_argument("access_level", type=str, required=True, help="Access level to grant", location='json')

@computer_ns.route("/<string:computer_mac>/rights")
class ComputerRights(Resource):
    @computer_ns.marshal_list_with(usercomputer_access_model)
    def get(self, computer_mac):
        """Get user rights for a specific computer"""
        return UserComputerRightsCRUD.get_all_rights_by_mac(computer_mac)

    @computer_ns.expect(usercomputer_access_input_model)
    @computer_ns.marshal_with(usercomputer_access_model, code=201)
    def post(self, computer_mac):
        """Assign user rights to a specific computer"""
        data = computer_ns.payload
        if 'email' not in data or 'systemAuthorityLevel' not in data:
            return {"msg": "Email and access level are required"}, 400
        return UserComputerRightsCRUD.create(
            email=data['email'],
            macAddress=computer_mac,
            systemAuthorityLevel=data['systemAuthorityLevel']
        ), 201
    
@computer_ns.route("/<string:computer_mac>/rights/grant")
class ComputerRightsGrant(Resource):
    @computer_ns.expect(grant_parser)
    @computer_ns.marshal_with(usercomputer_access_model, code=201)
    def post(self, computer_mac):
        """Grant user access to a specific computer"""
        args = grant_parser.parse_args()
        email = args['email']
        systemAuthorityLevel = args['systemAuthorityLevel']

        if not email or not systemAuthorityLevel:
            return {"msg": "Email and system authority level are required"}, 400

        user = UsersCRUD.get_by_email(email)
        if not user:
            return {"msg": "User not found"}, 404
        
        if UserComputerRightsCRUD.get_by_email_and_mac(email, computer_mac):
            return {"msg": "User already has rights for this computer"}, 400
        
        return UserComputerRightsCRUD.create(
            email=email,
            macAddress=computer_mac,
            systemAuthorityLevel=systemAuthorityLevel
        ), 201
    
from flask import request
from flask_restx import Resource, Namespace, reqparse
from src.extensions import api
from src.app import api_version_path
from flask_jwt_extended import jwt_required
from src.services.power.power_controller import wol_model, send_magic_packet, check_user_validity, send_one_ping
from src.model.datamodel.entityORM import ComputersCRUD

devicepower_ns  = Namespace('WOL', description='WOL endpoint', path=api_version_path+'/wol')

wol_req_parser = reqparse.RequestParser()
wol_req_parser.add_argument("mac", type="str", required=True, help="PC Mac Address", location="args")


@devicepower_ns.route("/wake")
class WakeOnLan(Resource):
    @jwt_required()
    @api.expect(wol_model)
    def post(self):
        data = request.json
        mac = data["mac"]
        if check_user_validity(mac):
            try:
                send_magic_packet(mac, "255.255.255.255")
                return {"status": "success", "message": f"Magic packet envoyé à {mac}"}, 200
            except Exception as e:
                return {"status": "error", "message": str(e)}, 400
        else: 
            return {"message": "You do not have this privileges"}


@devicepower_ns.route("/ping")
class PingDevice(Resource):
    @jwt_required()
    @api.expect(wol_req_parser)
    def get(self):
        data = request.json
        mac = data["mac"]
        if check_user_validity(mac):
            computer = ComputersCRUD.get_by_mac(mac)
            if not computer:
                return {"status": "error", "message": "Computer not found"}, 404
            ip_address = computer.localV4IpAddress
            timeout = 2  # seconds
            is_reachable = send_one_ping(ip_address, timeout)
            if is_reachable:
                return {"status": "success", "message": f"Device {mac} is reachable at {ip_address}"}, 200
            else:
                return {"status": "error", "message": f"Device {mac} is not reachable at {ip_address}"}, 404
        else:
            return {"message": "You do not have this privileges"}
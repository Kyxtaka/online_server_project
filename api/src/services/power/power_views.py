from flask import Flask, request
from flask_restx import Api, Resource, fields, Namespace
from src.extensions import api
from src.app import api_version_path
from src.model.datamodel.entityORM import Users, Computers, UserComputerRights, ComputersCRUD, UsersCRUD, UserComputerRightsCRUD, AppRoleList, OSList, StatusList
from src.model.datamodel.entityORM import AppRoleList, AccessList
from src.model.datamodel.entityModel import  computer_model, computer_input_model, user_model, user_input_model, usercomputer_access_model, usercomputer_access_input_model
from src.model.auth.auth_decorators import admin_required

import socket
import os
import re 


devicepower_ns  = Namespace('devicePower', description='devicePower endpoint', path=api_version_path+'/devicePower')



wol_model = api.model("WOL", {
    "mac": fields.String(required=True, description="Device MAC")
    # "broadcast": fields.String(required=False, description="Network Broadcas, 255.255.255.255 by default")
})

def send_magic_packet(mac_address: str, broadcast_ip: str = "255.255.255.255", port: int = 9):
    # MAC check 
    if not re.match(r"^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$", mac_address):
        raise ValueError("Adresse MAC invalide")

    # Bytes conversion
    mac_bytes = bytes.fromhex(mac_address.replace(":", "").replace("-", ""))
    magic_packet = b"\xff" * 6 + mac_bytes * 16

    # UDP packet send
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        sock.sendto(magic_packet, (broadcast_ip, port))

@devicepower_ns.route("/wake")
class WakeOnLan(Resource):
    @api.expect(wol_model)
    def post(self):
        data = request.json
        mac = data["mac"]
        # broadcast = data.get("broadcast", "255.255.255.255")

        try:
            send_magic_packet(mac, "255.255.255.255")
            return {"status": "success", "message": f"Magic packet envoyé à {mac}"}, 200
        except Exception as e:
            return {"status": "error", "message": str(e)}, 400
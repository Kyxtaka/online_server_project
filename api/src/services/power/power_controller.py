from flask import Flask, request
from flask_restx import Api, Resource, fields, Namespace, reqparse
from src.extensions import api
from src.app import api_version_path
from src.model.datamodel.entityORM import Users, Computers, UserComputerRights, ComputersCRUD, UsersCRUD, UserComputerRightsCRUD, AppRoleList, OSList, StatusList
from src.model.datamodel.entityORM import AppRoleList, AccessList
from src.model.datamodel.entityModel import  computer_model, computer_input_model, user_model, user_input_model, usercomputer_access_model, usercomputer_access_input_model
from src.model.auth.auth_decorators import admin_required, user_required
from flask_jwt_extended import verify_jwt_in_request, get_jwt, get_jwt_identity, jwt_required

import socket
import time
from flask import request
import struct
import os
import re
import datetime
# from datetime import timedelta

wol_model = api.model("WOL", {
    "mac": fields.String(required=True, description="Device MAC")
    # "broadcast": fields.String(required=False, description="Network Broadcas, 255.255.255.255 by default")
})

def calculate_checksum(source_string):
    """
    Calculate the checksum of the packet.
    """
    sum = 0
    count_to = (len(source_string) // 2) * 2
    count = 0

    while count < count_to:
        this_val = source_string[count + 1] * 256 + source_string[count]
        sum = sum + this_val
        sum = sum & 0xFFFFFFFF
        count = count + 2

    if count_to < len(source_string):
        sum = sum + source_string[-1]
        sum = sum & 0xFFFFFFFF

    sum = (sum >> 16) + (sum & 0xFFFF)
    sum = sum + (sum >> 16)
    answer = ~sum
    answer = answer & 0xFFFF
    answer = answer >> 8 | (answer << 8 & 0xFF00)
    return answer

def send_one_ping(ip_address: str, timeout: int) -> bool:
    """
    Send one ICMP ECHO_REQUEST and wait for a reply.
    """
    try:
        # Create a raw socket
        with socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_ICMP) as sock:
            sock.settimeout(timeout)

            # ICMP Header
            type = 8  # ICMP Echo Request
            code = 0
            checksum = 0
            identifier = os.getpid() & 0xFFFF # Use PID as identifier
            sequence = 1
            header = struct.pack("!BBHHH", type, code, checksum, identifier, sequence)

            # Payload
            padBytes = []
            startVal = 0x42
            for i in range(startVal, startVal + (56 - struct.calcsize("!BBHHH"))):
                padBytes += [(i & 0xFF)]
            data = bytes(padBytes)

            # Calculate checksum
            checksum = calculate_checksum(header + data)
            header = struct.pack("!BBHHH", type, code, checksum, identifier, sequence)
            packet = header + data

            # Send the packet
            sock.sendto(packet, (ip_address, 1))

            # Receive the response
            start_time = time.time()
            while True:
                try:
                    recv_packet, addr = sock.recvfrom(1024)
                    if addr[0] == ip_address:
                        return True
                except socket.timeout:
                    return False
                if time.time() - start_time > timeout:
                    return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False
    
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


def check_user_validity(mac: str) -> bool:    
    current_user = UsersCRUD.get_by_email(get_jwt_identity())
    print(f"Current Identified User for wol computer: {current_user.username} with mail {current_user.email}")
    if current_user.role == AppRoleList.ADMIN : return True
    access_rights = UserComputerRightsCRUD.get_by_email_and_mac(current_user.email, mac)
    if access_rights is not None:
        return True
    else: return False
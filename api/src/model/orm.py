from ..extensions import db
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, TIMESTAMP

class Users(db.Model):
    __tablename__ = 'USERS'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    role = Column(String(50), nullable=False)  # e.g., 'admin', 'user'
    password = Column(String(200), nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)  

class LiveComputer(db.Model):
    __tablename__ = 'LIVECOMPUTER'
    macaddress = Column(Integer, primary_key=True)
    ipaddress = Column(String(15), nullable=False)
    name = Column(String(50), nullable=False)
    hostname = Column(String(50), nullable=False)
    network = Column(String(50), nullable=False)  # e.g., 'LAN', 'WAN'
    os = Column(String(50), nullable=False)  # e.g., 'Windows', 'Linux'
    status = Column(String(20), nullable=False)  # e.g., 'online', 'offline'
    lastseen = Column(TIMESTAMP, nullable=False)

class UserComputerAccess(db.Model):
    __tablename__ = "USERCOMPUTERACCESS"
    email = Column(String(100), ForeignKey('USERS.email'), primary_key=True)
    macaddress = Column(Integer, ForeignKey('LIVECOMPUTER.macaddress'), primary_key=True)
    access_level = Column(String(50), name="systemauthoritylevel", nullable=False)  # e.g., 'user', 'admin'
from src.extensions import db
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, TIMESTAMP, Enum
from werkzeug.security import generate_password_hash, check_password_hash

import enum
class AppRoleList(enum.Enum):
    ADMIN = "ADMIN"
    USER = "USER"

    def __repr__(self):
        return self.value
    
    def __str__(self):
        return self.value
    
    def get_role(self):
        return self.value 

class AccessList(enum.Enum):
    ADMIN = "ADMIN"
    FRIENDS = "FRIENDS"
    GUEST = "GUEST"

    def __repr__(self):
        return self.value

    def __str__(self):
        return self.value

    def get_role(self):
        return self.value
    
class StatusList(enum.Enum):
    ONLINE = "ONLINE"
    OFFLINE = "OFFLINE"
    UNKNOWN = "UNKNOWN"

    def __repr__(self):
        return self.value

    def __str__(self):
        return self.value

    def get_status(self):
        return self.value
    
class OSList(enum.Enum):
    WINDOWS = "WINDOWS"
    LINUX = "LINUX"
    MACOS = "MACOS"
    OTHER = "OTHER"

    def __repr__(self):
        return self.value

    def __str__(self):
        return self.value
    
    def get_os(self):
        return self.value

class Computers(db.Model):
    __tablename__ = 'COMPUTERS'
    macAddress = Column(String(60), name="macAddress", primary_key=True)
    localV4IpAddress = Column(String(60), name="localV4IpAddress", nullable=False)
    v6IpAddress = Column(String(50), name="v6IpAddress", nullable=False)
    name = Column(String(50), name="name", nullable=False)
    hostname = Column(String(50), name="hostname", nullable=False)
    os = Column(Enum(OSList), name="os", nullable=False)  # e.g., 'Windows', 'Linux'
    status = Column(Enum(StatusList), name="status", nullable=False)  # e.g., 'online', 'offline'
    lastseen = Column(TIMESTAMP, name="lastseen", nullable=False)


    def __repr__(self):
        return f"<Computer {self.name} with MAC {self.macAddress} and IP {self.localV4IpAddress}> and OS {self.os}>"
    
    def __init__(self, macAddress, localV4IpAddress, v6IpAddress, name, hostname, os, status):
        self.macAddress = macAddress
        self.localV4IpAddress = localV4IpAddress
        self.v6IpAddress = v6IpAddress
        self.name = name
        self.hostname = hostname
        self.os = os
        self.status = status
        self.lastseen = db.func.current_timestamp()

class Users(db.Model):
    __tablename__ = 'USERS'
    id = Column(Integer, name="id", primary_key=True, autoincrement=True)
    username = Column(String(50), name="username", unique=True, nullable=False)
    email = Column(String(100), name="email", unique=True, nullable=False)
    role = Column(Enum(AppRoleList), name="role")  # e.g., 'ADMIN', 'FRIENDS', 'GUEST'
    password = Column(String(200), name="password", nullable=False)
    createdAt = Column(TIMESTAMP, name="createdAt", nullable=False)

    def __repr__(self):
        return f"<User {self.username}> with email {self.email} and role {self.role}>"  
    
    def __init__(self, username, email, role, password):
        self.username = username
        self.email = email
        self.role = role
        self.password = password
        self.createdAt = db.func.current_timestamp()
    
class UserComputerRights(db.Model):
    __tablename__ = "USERCOMPUTERRIGHTS"
    email = Column(String(100), ForeignKey('USERS.email'), name="email", primary_key=True)
    macAddress = Column(Integer, ForeignKey('COMPUTERS.macAddress'), name="macAddress", primary_key=True)
    systemAuthorityLevel = Column(Enum(AccessList), name="systemAuthorityLevel", nullable=False)  # e.g., 'ADMIN', 'FRIENDS', 'GUEST'

    def __repr__(self):
        return f"<UserComputerRights {self.email} with MAC {self.macAddress} and Authority Level {self.systemAuthorityLevel}>"

    def __init__(self, email, macAddress, systemAuthorityLevel):
        self.email = email
        self.macAddress = macAddress
        self.systemAuthorityLevel = systemAuthorityLevel

class UsersCRUD:
    @staticmethod
    def get_by_email(email) -> Users:
        return Users.query.filter_by(email=email).first()
    
    @staticmethod
    def get_by_id(user_id):
        return Users.query.get(user_id)
    
    @staticmethod
    def get_all_users():
        return Users.query.all()
    
    @staticmethod
    def get_all_users_by_role(role):
        return Users.query.filter_by(role=AppRoleList(role)).all()
    
    @staticmethod
    def create(username:str, email:str, role:str, password:str) -> Users:
        user = Users(username, email, AppRoleList(role), generate_password_hash(password))
        print(f"Creating user with username: {username}, email: {email}, role: {role}")
        db.session.add(user)
        db.session.commit()
        return user
    
    @staticmethod
    def update(id:int, username:str, email:str, role:str, password:str) -> None:
        user:Users = Users.query.get(id)
        if not user:
            return None
        user.username = username
        user.email = email
        user.role = AppRoleList(role)
        user.password = generate_password_hash(password)
        print(f"Updating user with id: {id}, username: {username}, email: {email}, role: {role}")
        db.session.commit()

    @staticmethod
    def delete(id:int) -> bool: 
        user:Users = Users.query.get(id)
        if not user:
            return False
        db.session.delete(user)
        db.session.commit()
        return True
    
class ComputersCRUD:
    @staticmethod
    def get_by_mac(macAddress) -> Computers:
        return Computers.query.filter_by(macAddress=macAddress).first()
    
    @staticmethod
    def get_all_computers():
        return Computers.query.all()
    
    @staticmethod
    def create(macAddress:str, localV4IpAddress:str, v6IpAddress:str, name:str, hostname:str, os:str, status:str) -> Computers:
        computer = Computers(macAddress, localV4IpAddress, v6IpAddress, name, hostname, OSList(os), StatusList(status))
        print(f"Creating computer with MAC: {macAddress}, IP: {localV4IpAddress}, Name: {name}, OS: {os}, Status: {status}")
        db.session.add(computer)
        db.session.commit()
        return computer
    
    @staticmethod
    def update(macAddress:str, localV4IpAddress:str, v6IpAddress:str, name:str, hostname:str, os:str, status:str) -> None:
        computer:Computers = Computers.query.filter_by(macAddress=macAddress).first()
        if not computer:
            return None
        computer.localV4IpAddress = localV4IpAddress
        computer.v6IpAddress = v6IpAddress
        computer.name = name
        computer.hostname = hostname
        computer.os = OSList(os)
        computer.status = StatusList(status)
        print(f"Updating computer with MAC: {macAddress}, IP: {localV4IpAddress}, Name: {name}, OS: {os}, Status: {status}")
        db.session.commit()

    @staticmethod
    def delete(macAddress:str) -> bool:
        computer:Computers = Computers.query.filter_by(macAddress=macAddress).first()
        if not computer:
            return False
        db.session.delete(computer)
        db.session.commit()
        return True
    
class UserComputerRightsCRUD:
    @staticmethod
    def get_by_email_and_mac(email:str, macAddress:str) -> UserComputerRights:
        return UserComputerRights.query.filter_by(email=email, macAddress=macAddress).first()
    
    @staticmethod
    def get_all_rights_by_email(email:str) -> list[UserComputerRights]:
        return UserComputerRights.query.filter_by(email=email).all()
    
    @staticmethod
    def get_all_rights_by_mac(macAddress:str) -> list[UserComputerRights]:
        return UserComputerRights.query.filter_by(macAddress=macAddress).all()
    
    @staticmethod
    def get_all_rights():
        return UserComputerRights.query.all()
    
    @staticmethod
    def create(email:str, macAddress:str, systemAuthorityLevel:str) -> UserComputerRights:
        rights = UserComputerRights(email, macAddress, AccessList(systemAuthorityLevel))
        print(f"Creating user computer rights for email: {email}, MAC: {macAddress}, Authority Level: {systemAuthorityLevel}")
        db.session.add(rights)
        db.session.commit()
        return rights
    
    @staticmethod
    def update(email:str, macAddress:str, systemAuthorityLevel:str) -> None:
        rights:UserComputerRights = UserComputerRights.query.filter_by(email=email, macAddress=macAddress).first()
        if not rights:
            return None
        rights.systemAuthorityLevel = AccessList(systemAuthorityLevel)
        print(f"Updating user computer rights for email: {email}, MAC: {macAddress}, Authority Level: {systemAuthorityLevel}")
        db.session.commit()
        return rights

    @staticmethod
    def delete(email:str, macAddress:str) -> bool:
        rights:UserComputerRights = UserComputerRights.query.filter_by(email=email, macAddress=macAddress).first()
        if not rights:
            return False
        db.session.delete(rights)
        db.session.commit()
        return True
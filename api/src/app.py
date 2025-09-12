from flask import Flask
from src.extensions import db, api, jwt, api_bp
import os
from os.path import join, dirname
from dotenv import load_dotenv
from flask_cors import CORS
app = Flask(__name__)

dotentv_path = join(dirname(__file__), '..','.flaskenv')
load_dotenv(dotenv_path=dotentv_path)
prod = False
if os.getenv("ENVIRONMENT") != "dev": prod = True
#SETUP DB
db_user = os.getenv("DB_USER")
db_pwd = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")
db_port = os.getenv("DB_PORT")

if prod: db_port = os.getenv("DB_PORT_PROD")
db_uri = "mysql://"+db_user+":"+db_pwd+"@"+db_host+":"+db_port+"/"+db_name
app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
db.init_app(app)

# SETUP JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ALGORITHM"] = "HS256"
jwt.init_app(app)

#SETUP API
api_version_path = "/api/v1"
api.init_app(app)

#SETUP CORS
authorized_clients = [
    "https://stm.hikarizsu.fr", 
    "https://stmclient.hikarizsu.fr",
    "http://localhost:4200"
]
CORS(app, supports_credentials=True, origins=authorized_clients)

#Namespaces
from src.services.users.users_views import user_ns
from src.services.auth.auth_views import auth_ns
from src.services.admin.admin_views import admin_ns
from src.services.computers.computers_views import computer_ns, computer_rights_ns
from src.services.power.power_views import devicepower_ns
all_namespaces = [user_ns, auth_ns, admin_ns, computer_ns, devicepower_ns, computer_rights_ns]
for ns in all_namespaces:
    api.add_namespace(ns)
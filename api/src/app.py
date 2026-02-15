from flask import Flask
from src.extensions import db, api, jwt, api_bp
from os.path import join, dirname
from dotenv import load_dotenv
from flask_cors import CORS
from src.config import config

# Load environment variables
dotenv_path = join(dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)

# SETUP DB
app.config["SQLALCHEMY_DATABASE_URI"] = config.database_url
db.init_app(app)

# SETUP JWT
app.config["JWT_SECRET_KEY"] = config.jwt_secret_key
app.config["JWT_ALGORITHM"] = "HS256"
jwt.init_app(app)

# SETUP API
# app.register_blueprint(api_bp)
app.register_blueprint(api_bp, url_prefix="/api")
# api.init_app() not needed - API is already initialized with Blueprint in extensions.py

# SETUP CORS
CORS(app, supports_credentials=True, origins=config.access_cors)

#Namespaces
from src.services.users.users_views import user_ns
from src.services.auth.auth_views import auth_ns
from src.services.admin.admin_views import admin_ns
from src.services.computers.computers_views import computer_ns, computer_rights_ns
from src.services.power.power_views import devicepower_ns
all_namespaces = [user_ns, auth_ns, admin_ns, computer_ns, devicepower_ns, computer_rights_ns]
for ns in all_namespaces:
    api.add_namespace(ns)

from flask import Flask
from .extensions import db, api, jwt
import os
from os.path import join, dirname
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
app = Flask(__name__)

dotentv_path = join(dirname(__file__), '.flaskenv')
load_dotenv(dotenv_path=dotentv_path)

#SETUP DB
db_user = os.getenv("DB_USER")
db_pwd = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")
db_port = os.getenv("DB_PORT")
db_uri = "mysql://"+db_user+":"+db_pwd+"@"+db_host+":"+db_port+"/"+db_name
db.init_app(app)
app.config["SQLALCHEMY_DATABASE_URI"] = db_uri

# SETUP JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ALGORITHM"] = "HS256"  
jwt.init_app(app)


#SETUP API
api_version_path = "/api/v1"
api.init_app(app)

#Namespaces
from .services.hellowviews import hello_ns
from .services.usersviews import user_ns
api.add_namespace(hello_ns, path=api_version_path)    
api.add_namespace(user_ns, path=api_version_path)
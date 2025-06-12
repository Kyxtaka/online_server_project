from flask import Flask
from .extensions import db,api
import os
from os.path import join, dirname
from dotenv import load_dotenv

dotentv_path = join(dirname(__file__), '.flaskenv')
load_dotenv(dotenv_path=dotentv_path)
db_user = os.getenv("DB_USER")
db_pwd = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")
db_port = os.getenv("DB_PORT")
db_uri = "mysql://"+db_user+":"+db_pwd+"@"+db_host+":"+db_port+"/"+db_name


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
api.init_app(app)
db.init_app(app)


from .views.hellowviews import ns
api_version_path = "/api/v1"
api.add_namespace(ns, path=api_version_path + "/hello")    
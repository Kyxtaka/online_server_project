# Deployemenmt status
Test Server : [![Projet CI Docker Push Docker image](https://github.com/Kyxtaka/online_server_project/actions/workflows/ci-cd.yml/badge.svg?branch=develop&event=branch_protection_rule)](https://github.com/Kyxtaka/online_server_project/actions/workflows/ci-cd.yml) 

[![Projet CI Docker Push Docker image](https://github.com/Kyxtaka/online_server_project/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Kyxtaka/online_server_project/actions/workflows/ci.yml)

# Web application for managing big computers from online with a small ssh server
This project is a small web based application for managing big home computers from online via a small ssh server.
I made this project to wake up and shutdown my home computers without being worried about my electricity bill, this is usefull if you have 
2 or 4 computer that consume more than 300 Watts (750, 400, 450 and 200 in my case).

## Application features 
- Wake up and shutdown your computers from everywhere 
- Have a look for wich computer is online or shutdown
- Have a list of users for every listed PC

## Flask Rest-X api Installation steps 
### Requirements
- Have a ssh server wich can be acces from wan via static IPv4 or an IPv6
- Python 3.13 installed
- NGINX server for web hosting
- MariaDB for database

### Steps on linux
1. API setup

To see the API installation guide click [here](https://github.com/Kyxtaka/online_server_project/tree/main/api)


### Steps on vindows 
Note : It more preferable to install pytthon 3.13 from the online python support, it would install the `py` cli
- Clone this repository
- create python virtual environnement `py -3.13 -m venv .venv` 
- activate the venv with `.venv/Script/activate`
- install python project dependencies with pip `pip install -r requirements.txt` 
- mode to the focder ./api `cd ./api`
- create the .flaskenv ==> follow steps below
- then run the api `flask run` or `flask run --debug` for debugging mod

### Creating the .fkaskenv file
In order to launch the api, you have to set some sensitive credential that cannot be displayed inside the code. 
Such has database connection credential or the JWT secret key for token signature. 
Here is the .flaskenv file template used for the api  
```
FLASK_APP=src
FLASK_DEBUG=1
ENVIRONMENT=development 
DB_USER=<db api user>
DB_PASSWORD=<db user pwd>
DB_NAME=<db name>
DB_PORT=<db port>
DB_HOST=<db host url or IP>
JWT_SECRET_KEY=<jwt base-64 secret key>
```

# Project Status : Under Developpement
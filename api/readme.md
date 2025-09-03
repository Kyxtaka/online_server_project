# Home Server Management tool API
This a very small backend api made with flaskrestx, a framwork that allow you to create small RestFul API rapidly

# Installation Steps
Guide for installation
## Developpement environnement
First of all ensure that you activated you **virtual environnement** and installed all dependencies

reminder (execute it from que project root folder)
```bash
.venv/bin/activate
cd ./api
pip install -r requirements.txt
```

You can know run the API for developpment purposes
```bash
flask run
```

ps : Dont forget to create your .flaskenv
```env
FLASK_APP=src
FLASK_DEBUG=1
ENVIRONMENT=development 
DB_USER=<DB apiuser>
DB_PASSWORD=<DB api user pwd>
DB_NAME=<DB name>
DB_PORT=<DB listen port>
DB_HOST=<FB host url or IP>
JWT_SECRET_KEY=<JWT secret key>
```
# API Documentation
API version : `1.0`
## API Endpoint
### Users : 


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

## Production environnement
1. clone the repo and move to the api root folder
```bash
git clone https://github.com/<your-repo>.git
cd ./online_server_project/api
```
2. Generate ssl certificates with certbot
```bash
sudo systemctl stop nginx
sudo certbot certonly --standalone -d <api.url>
```

**Warning** : with certbot, --standalone needs nginx to be stopped (for server check), dont forget to desactivate your nginx server before running those commands

**note** : If you use nginx for a reverse proxy just like me, create your certificates in standalone
it will make a clean certificates generation and will not override you actual nginx con in your server

those certificates are stored at `/etc/letsencrypt/live/<api domaine>/`

3. Configure NGINX reverse proxy (in order to communicate with the api container)
```bash
sudo vim /etc/nginx/sites-available/stm.api.hikarizsu.fr
```
personally I use vim, but you can do it with nano

Edit you conf just like this
```bash
# API
server {
    listen 80;
    server_name stm.api.hikarizsu.fr;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name stm.api.hikarizsu.fr;

    ssl_certificate     /etc/letsencrypt/live/<api url>/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<api url>/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8143;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
4. activate this conf
```bash
sudo ln -s /etc/nginx/sites-available/stm.api.hikarizsu.fr /etc/nginx/sites-enabled/ #create a link
sudo nginx -t
sudo systemctl reload nginx
```

5. Build api container and run it 
```bash
docker compose build
docker compose up -d
```

Then test it 

# API Documentation
API url : [stm.api.hikarizsu.fr](hikarizsu.fr)

API version : `1.0`

# API Endpoint
Here is the Endpoint documentation section, this is where you will get the whole api documentation and learn how it works. 

To begin, every endpoint from this API is preceded by `/api/<api version>/`. The current api version is `1.0` so the global api endpoint path will be `stm.api.hikrizsu.fr/api/v1/`
## Users : `/users` 
Contains every operation related to every user
- POST *Admin required*
Expected body
```json
{
  "username": "string",
  "email": "string",
  "role": "string",
  "password": "string"
}
```

- PUT `/users/<id>`

Path parameter **id** : THe user Id in the DB

Expected Body
```json
{
  "username": "string",
  "email": "string",
  "role": "string",
  "password": "string"
}
```
- GET `/users/<id>`

Answer Schema 

```json
{
  "id": 0,
  "username": "string",
  "email": "string",
  "role": "string",
  "createdAt": "2025-09-04T09:47:26.676Z"
}
```
- DELETE `/users/<id>` *Admin required*

Path parameter **id** : THe user Id in the DB

Returns

```json
{
    "msg" : "string"
}
```


## Admin : `/admin` *Admin required*

Contains every operation

- GET  `/admin/users` : return the list of all users

```json
[
  {
    "id": 0,
    "username": "string",
    "email": "string",
    "role": "string",
    "createdAt": "2025-09-04T09:51:25.516Z"
  }
]
```


## Auth : `/auth`
- POST `/auth/login` : route for login 

Below is the body schema
```json
{
    "username": "string",
    "password": "string"
}
```
## Computers `/computers`
### All computers `/computers`
- POST *Admin required*



API expected body
```json
{
  "macAddress": "string",
  "localV4IpAddress": "string",
  "v6IpAddress": "string",
  "name": "string",
  "hostname": "string",
  "os": "string",
  "status": "string"
}
```
- GET

Returns
```json
[
  {
    "macAddress": "string",
    "localV4IpAddress": "string",
    "v6IpAddress": "string",
    "name": "string",
    "hostname": "string",
    "os": "string",
    "status": "string",
    "lastseen": "2025-09-04T09:52:10.690Z"
  }
]
```

### Specific computer `/computers/{computer MAC}`
- PUT `/computers/<computer_mac/>` *Admin required*

Expects
```json
{
  "macAddress": "string",
  "localV4IpAddress": "string",
  "v6IpAddress": "string",
  "name": "string",
  "hostname": "string",
  "os": "string",
  "status": "string"
}
```
- DELETE `/computers/<computer_mac/>` *Admin required* 

**Returns**
```json
{
    "msg" : "string"
}
```

Path parameter `computer_mac` : Mac Address of the computer

- GET `/computers/<computer_mac/>`

**Returns**
```json
[
  {
    "macAddress": "string",
    "localV4IpAddress": "string",
    "v6IpAddress": "string",
    "name": "string",
    "hostname": "string",
    "os": "string",
    "status": "string",
    "lastseen": "2025-09-04T09:27:45.432Z"
  }
]
```

### Specific computer rights `/computers/{computer MAC}/rights` *Admin required*

- GET **(Admin priviledges required)**

route that permit operation such list, grant, revoke any rights for a computer identified by his mac address. There is some specific case, this route works with args
- `query` : the operation to run it can only be `listAll`, `grant` or `revoke`
- `email` : in case if you use the *grant* or *revoke* opération this fields is required. If you sent your request with a null value, the API response will result with a 400 BAD REQUEST
- `access_level` (use with `grant`) : The authorization that you will give to the given user email. It can only be `ADMIN`, `FRIENDS` or `GUEST` 
- path variable `computer_mac` : This field is required, it permit to identify the concerned computer

**Returns**
```json
[
  {
    "email": "string",
    "macAddress": "string",
    "systemAuthorityLevel": "string"
  }
]
```
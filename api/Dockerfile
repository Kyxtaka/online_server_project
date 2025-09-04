FROM python:3.12.10

# Installer les dépendances pour mysqlclient
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    libssl-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:81443", "--certfile=/etc/letsencrypt/live/stm.api.hikarizsu.fr/fullchain.pem", "--keyfile=/etc/letsencrypt/live/stm.api.hikarizsu.fr/privkey.pem", "src.app:app"]

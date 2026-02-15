import os
from typing import List


class Config:
    # Flask configuration
    flask_app: str
    flask_debug: bool

    # Environment
    environment: str

    # Database configuration
    db_user: str
    db_password: str
    db_name: str
    db_host: str
    db_port: int
    database_url: str

    # JWT
    jwt_secret_key: str

    # API configuration
    api_url: str
    api_port: int

    # CORS
    access_cors: List[str]

    def __init__(self):
        # Flask configuration
        self.flask_app = os.getenv('FLASK_APP', 'src')
        self.flask_debug = os.getenv('FLASK_DEBUG', '0').lower() in ('true', '1', 't')

        # Environment (development, staging, prod)
        self.environment = os.getenv('ENVIRONMENT', 'development').lower()

        # Database configuration
        self.db_user = os.getenv('DB_USER', 'apiuser')
        self.db_password = os.getenv('DB_PASSWORD', '')
        self.db_name = os.getenv('DB_NAME', 'SERVMANAGEMENT')
        self.db_host = os.getenv('DB_HOST', 'localhost')

        # Adjust port based on environment
        if self.environment == 'prod':
            self.db_port = int(os.getenv('DB_PORT_PROD', '3307'))
        else:
            self.db_port = int(os.getenv('DB_PORT', '3308'))

        # Build database URL (MySQL with mysqlclient driver)
        self.database_url = (
            f"mysql+mysqldb://{self.db_user}:{self.db_password}@"
            # f"mysql+pysql://{self.db_user}:{self.db_password}@"
            f"{self.db_host}:{self.db_port}/{self.db_name}"
        )

        # JWT configuration
        self.jwt_secret_key = os.getenv('JWT_SECRET_KEY', 'your-jwt-secret-key')

        # API configuration
        self.api_url = os.getenv('PROD_API_URL', 'localhost')
        self.api_port = int(os.getenv('API_PORT', '5000'))

        # CORS - Parse comma-separated or newline-separated URLs
        cors_raw = os.getenv(
            'ACCESS_CORS',
            'http://localhost:4200'
        )
        self.access_cors = [
            url.strip() for url in cors_raw.replace('\n', ',').split(',')
            if url.strip()
        ]


# Create singleton instance
config = Config()


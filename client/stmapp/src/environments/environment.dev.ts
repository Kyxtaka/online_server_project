const protocol: string = 'http';
const apiBaseUrl: string = 'localhost:8000';
const APIBaseRoute: string = '/api';

export const environment = {
  production: false,
  API_DOMAIN: apiBaseUrl,
  API_URL: `${protocol}://${apiBaseUrl}`,
  API_URL_BASE_ROUTE_V1: `${protocol}://${apiBaseUrl}${APIBaseRoute}`,
};

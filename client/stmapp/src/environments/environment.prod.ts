const protocol: string = 'https';
const apiBaseUrl: string = 'stm-api.home.hikarizsu.fr';
const APIBaseRoute: string = '/api';

export const environment = {
  production: true,
  API_DOMAIN: apiBaseUrl,
  API_URL: `${protocol}://${apiBaseUrl}`,
  API_URL_BASE_ROUTE_V1: `${protocol}://${apiBaseUrl}${APIBaseRoute}`,
  JWT_ALLOWED_DOMAINS: [`${protocol}://${apiBaseUrl}`],
};

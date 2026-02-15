const protocol: string = 'https';
const apiBaseUrl: string = 'stm-test.home.hikarizsu.fr';
const APIBaseRoute: string = '/api/v1';

export const environment = {
  production: false,
  API_DOMAIN: apiBaseUrl,
  API_URL: `${protocol}://${apiBaseUrl}`,
  API_URL_BASE_ROUTE_V1: `${protocol}://${apiBaseUrl}${APIBaseRoute}`,
};

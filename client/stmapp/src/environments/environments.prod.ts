const protocol: string = "https"
const apiBaseUrl: string = "stm-api.hikarizsu.fr"
const port: number = 8080
const APIBaseRoute: string= "api/v1"


export const environment = {
    API_DOMAIN: `${apiBaseUrl}`,
    API_URL_PORT: `${protocol}://${apiBaseUrl}:${port}`,
    API_URL: `${protocol}://${apiBaseUrl}${APIBaseRoute}`,
    API_URL_BASE_ROUTE_V1: `${protocol}://${apiBaseUrl}/${APIBaseRoute}`
}

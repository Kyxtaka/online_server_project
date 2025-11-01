const protocol: string = "https"
const apiBaseUrl: string = "stm-api.hikarizsu.fr"
const port: number = 8080
const APIBaseRoute: string= "/api/v1"


export const environment = {
    APIURL_PORT: `${protocol}://${apiBaseUrl}:${port}/${APIBaseRoute}`,
    APIURL: `${protocol}://${apiBaseUrl}${APIBaseRoute}`
}

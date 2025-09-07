import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

interface accesTokenResponse {
  access_token: string
}

@Injectable({
  providedIn: 'root'
})
export class ApiAuthAService {
  private api: string = environment.APIURL;

  private apiAuthEndpoint: string = `${this.api}/auth/login`;

  constructor(private httpClient: HttpClient) { }

  login(identifier: string, password: string): Observable<accesTokenResponse> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'})
    const body = { "username":identifier, password}
    return this.httpClient.post<accesTokenResponse>(this.apiAuthEndpoint, body, { headers })
  }

}

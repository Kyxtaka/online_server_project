import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { accesTokenResponse } from '../../../models/api/response/auth-response';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthAService {
  private api: string = environment.APIURL;

  private apiAuthEndpoint: string = `${this.api}/auth/login`;
  private testEnd: string = `${this.api}/admin/users`;

  constructor(private httpClient: HttpClient) {}

  login(identifier: string, password: string): Observable<accesTokenResponse> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'})
    const body = { "username":identifier, password}
    return this.httpClient.post<accesTokenResponse>(this.apiAuthEndpoint, body, { headers })
  }

  test(): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'})
    return this.httpClient.get(this.testEnd, { headers })
  }

}

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {
  constructor() {}
}

@Injectable({
  providedIn: 'root'
})
export class ApiAdminService{
  constructor() {}
}

@Injectable({
  providedIn: 'root'
})
export class ApiComputerService{
  constructor() {}
}

@Injectable({
  providedIn: 'root'
})
export class ApiComputerRightsService{
  constructor() {}
}

@Injectable({
  providedIn: 'root'
})
export class ApiWolService{
  constructor() {}
}
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { accesTokenResponse } from '../../../models/api/response/auth-response';
import { UserDTO } from '../../../models/dto/userDTO';
import { ComputerDTO } from '../../../models/dto/computerDTO';
import { MsgResponse } from '../../../models/api/response/msg-response';

@Injectable({
  providedIn: 'root',
})
export class ApiAuthAService {
  private api: string = environment.API_URL_BASE_ROUTE_V1;
  private httpClient: HttpClient = inject(HttpClient);

  private apiAuthEndpoint: string = `${this.api}/auth/login`;

  constructor() {}

  login(identifier: string, password: string): Observable<accesTokenResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username: identifier, password };
    return this.httpClient.post<accesTokenResponse>(
      this.apiAuthEndpoint,
      body,
      { headers },
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class ApiUserService {
  private api: string = environment.API_URL_BASE_ROUTE_V1;
  private userEndpoint: string = `${this.api}/user`;
  private httpClient: HttpClient = inject(HttpClient);

  constructor() {}

  getUserInfos(): Observable<UserDTO> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get<UserDTO>(this.userEndpoint, { headers });
  }
}

@Injectable({
  providedIn: 'root',
})
export class ApiAdminService {
  private api: string = environment.API_URL_BASE_ROUTE_V1;
  private endpoint: string = `${this.api}/admin`;
  private httpClient: HttpClient = inject(HttpClient);
  constructor() {}

  getAllUserInfos(): Observable<UserDTO[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get<UserDTO[]>(`${this.endpoint}/users`, {
      headers,
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class ApiComputerService {
  private api: string;
  private computerEnpoint: string;
  private httpClient: HttpClient = inject(HttpClient);

  constructor() {
    this.api = environment.API_URL_BASE_ROUTE_V1;
    this.computerEnpoint = `${this.api}/computers`;
  }

  getComputersInfos(): Observable<ComputerDTO[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get<ComputerDTO[]>(this.computerEnpoint, {
      headers,
    });
  }

  getIndividualComputerInfos(
    individualMacAdress: string,
  ): Observable<ComputerDTO> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get<ComputerDTO>(
      `${this.computerEnpoint}/${individualMacAdress}`,
      { headers },
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class ApiComputerRightsService {
  constructor() {}
}

@Injectable({
  providedIn: 'root',
})
export class ApiWolService {
  private api: string;
  private wolEndpoint: string;
  private httpClient: HttpClient = inject(HttpClient);

  constructor() {
    this.api = environment.API_URL_BASE_ROUTE_V1;
    this.wolEndpoint = `${this.api}/wol/wake`;
  }

  wake(pcMac: string): Observable<MsgResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { mac: pcMac };
    return this.httpClient.post<MsgResponse>(this.wolEndpoint, body, {
      headers,
    });
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { accesTokenResponse } from '../../../models/api/response/auth-response';
import {
  UserDTO,
  UserRegistrationDTO,
  UserUpdateDTO,
  UserChangePasswordDTO
} from '../../../models/dto/userDTO';
import { ComputerDTO } from '../../../models/dto/computerDTO';
import { MsgResponse } from '../../../models/api/response/msg-response';
import { generateRandomPassword } from '../../utils/string-generator';

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

  register(
    username: string,
    email: string,
    role: string,
  ): Observable<MsgResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const password = generateRandomPassword(12);
    const body: UserRegistrationDTO = { username, email, role, password };
    return this.httpClient.post<MsgResponse>(
      `${this.userEndpoint}/register`,
      body,
      { headers },
    );
  }

  getUserInfos(): Observable<UserDTO> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get<UserDTO>(this.userEndpoint, { headers });
  }

  deleteUser(userId: number): Observable<MsgResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.delete<MsgResponse>(
      `${this.userEndpoint}/${userId}`,
      {
        headers,
      },
    );
  }

  updateUser(userData: UserDTO, userUpdateDTO: UserUpdateDTO): Observable<MsgResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put<MsgResponse>(`${this.userEndpoint}/${userData.id}`, userUpdateDTO, {headers,});
  }

  changePassword(UserData: UserDTO, userChangePasswordDTO: UserChangePasswordDTO): Observable<MsgResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put<MsgResponse>(
      `${this.userEndpoint}/${UserData.id}/changePassword`,
      userChangePasswordDTO,
      { headers },
    );
  }

  // TODO serverside implementation needed
  // requestPasswordReset(email: string): Observable<MsgResponse> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const body = { email };
  //   return this.httpClient.post<MsgResponse>(
  //     `${this.userEndpoint}/request-password-reset`,
  //     body,
  //     { headers },
  //   );
  // }
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
  private api: string = environment.API_URL_BASE_ROUTE_V1;
  private computerEnpoint: string;
  private httpClient: HttpClient = inject(HttpClient);

  constructor() {
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

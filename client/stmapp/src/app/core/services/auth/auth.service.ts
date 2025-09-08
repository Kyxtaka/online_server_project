import { Injectable } from '@angular/core';
import { CookieService, CookieOptions } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, Timestamp } from 'rxjs';
import { ApiAuthAService} from '../api/api.service';

export enum Privilege {
  USER = "USER",
  ADMIN = "ADMIN"
};



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService, private jwtHelper: JwtHelperService, private apiAuthService: ApiAuthAService) { }

  private token_name: string = "access_token";

  logout(): void {
    this.cookieService.delete(this.token_name);
    
  }

  login(identifier: string, password: string): Observable<boolean>  {
    console.log("logging...");
    return this.apiAuthService.login(identifier, password).pipe(
      map(res => {
        this.setToken(res.access_token);
        return true;
      }),
      catchError(err => {
        console.error("Login error", err);
        return of(false);
      })
    );
  }


  setToken(token: string): void {
    const expirationDate: Date | null = this.jwtHelper.getTokenExpirationDate(token);; // Convert to milliseconds
    if (expirationDate) {
      this.cookieService.set(this.token_name, token, { expires: expirationDate, secure: true });
    }else {
      console.log("error, unable to set token")
    }
  }

  getToken(): string {
    const token: string | null = this.cookieService.get(this.token_name)
    return token
  }

  isTokenExpired(): boolean {
    const token: string | null = this.getToken()
    const isExpired: boolean = this.jwtHelper.isTokenExpired(token)
    console.log(`token is present: ${token}`)
    console.log(`isExpired: `, isExpired)
    console.log(`token is null : ${!token} || isExpired ${isExpired}`)
    return !token || isExpired  
  }

  isLoggedIn(): boolean {
    console.log(`isLoggedIn (not expired):`, !this.isTokenExpired())
    return !this.isTokenExpired();
  }

  getUserIdentifier(): string {
    return ""
  }

  getHttpRequestHeader(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  



}


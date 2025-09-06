import { Injectable } from '@angular/core';
import { CookieService, CookieOptions } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Timestamp } from 'rxjs';

export enum Privilege {
  USER = "USER",
  ADMIN = "ADMIN"
};

export interface UserData {
  userId: number,
  username: string,
  email: string,
  roles: Privilege[] | null,
  createdAt: Date | null
}

// export function tokenGetter() {
//   cookieStore.get("access_level")
// }

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  constructor(private cookieService: CookieService, private jwtHelper: JwtHelperService) { 
    
  }

  private token_name: string = "access_level";

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
    return !token || !isExpired  
  }

  isLoggedIn(): boolean {
    return this.isTokenExpired();
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

  logout(): void {
    this.cookieService.delete(this.token_name)
  }



}


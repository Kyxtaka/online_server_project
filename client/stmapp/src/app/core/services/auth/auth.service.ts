import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiAuthAService } from '../api/api.service';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { AppRoutes } from '../../../app.routes';
import { ComputerService } from '../computer/computer.service';

export enum Privilege {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private cookieService = inject(CookieService);
  private jwtHelper = inject(JwtHelperService);
  private apiAuthService = inject(ApiAuthAService);
  private router = inject(Router);
  private userService = inject(UserService);
  private computerService = inject(ComputerService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor() {}

  private token_name: string = 'access_token';

  logout(): void {
    this.cookieService.delete(this.token_name);
    this.userService.logout();
    this.computerService.logout();
    this.router.navigate([AppRoutes.LOGIN]);
  }

  login(identifier: string, password: string): Observable<boolean> {
    return this.apiAuthService.login(identifier, password).pipe(
      map((res) => {
        this.setToken(res.access_token);
        this.userService.retriveUserInfos();
        return true;
      }),
      catchError((err) => {
        console.error('Login error', err);
        return of(false);
      }),
    );
  }

  setToken(token: string): void {
    const expirationDate: Date | null =
      this.jwtHelper.getTokenExpirationDate(token); // Convert to milliseconds
    if (expirationDate) {
      this.cookieService.set(this.token_name, token, {
        expires: expirationDate,
        secure: true,
      });
    }
  }

  getToken(): string {
    const token: string | null = this.cookieService.get(this.token_name);
    return token;
  }

  isTokenExpired(): boolean {
    const token: string | null = this.getToken();
    const isExpired: boolean = this.jwtHelper.isTokenExpired(token);
    return !token || isExpired;
  }

  isLoggedIn(): boolean {
    this.isTokenExpired() ? this.logout() : false;
    return !this.isTokenExpired();
  }

  getUserIdentifier(): string {
    return '';
  }

  getHttpRequestHeader(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    });
  }
}

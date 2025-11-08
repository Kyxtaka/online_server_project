import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { AppRoutes } from '../../../app.routes';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  canActivate(): boolean {
    console.log('AuthGuard token check:', this.authService.getToken());
    if (!this.authService.isLoggedIn()) {
      this.router.navigate([AppRoutes.LOGIN]); // redirige vers login si pas connecté
      return false;
    }
    return true;
  }
}

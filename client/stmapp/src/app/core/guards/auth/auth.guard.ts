import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log("AuthGuard token check:", this.authService.getToken());
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // redirige vers login si pas connecté
      return false;
    }
    return true;
  }
}
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

// export const authGuard: CanActivateFn = (route, state) => {

//   constructor(private authService: AuthService, private router: Router) {}
//   // return true;
//   if (!this.authService.isLoggedIn()) {
//       this.router.navigate(['/login']); // redirige vers login si pas connecté
//       return false;
//     }
//     return true;
// };
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // redirige vers login si pas connecté
      return false;
    }
    return true;
  }
}
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import 'reflect-metadata';
import { UserService } from '../../services/user/user.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userService = inject(UserService);
  const component = route.component as any;

  const requiredRole = Reflect.getMetadata('requiredRole', component);
  // if (requiredRole && !authService.hasRole(requiredRole)) {
  //   return router.createUrlTree(['/forbidden']);
  // }
  return true;
};

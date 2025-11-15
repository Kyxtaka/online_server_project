import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { LogoutComponent } from './features/auth/logout/logout.component';

// const userConnectedPrefix: string = "connected/"

export enum AppRoutes {
  HOME = 'home',
  LOGIN = 'login',
  LOGOUT = 'disconnect',
  ACCOUNTCENTER = 'accountcenter',
  NOTFOUND = 'notfound',
}

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  // TODO : Implement Account center route and component
  {
    path: '**',
    component: NotFoundComponent,
  },
];

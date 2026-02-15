import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { LogoutComponent } from './features/auth/logout/logout.component';
import { AccountCenterComponent } from './features/accountcenter/accountcenter.component';
import { AccountInformationComponent } from './features/accountcenter/accountinformation/accountinformation.component';
import { AccountSecurityComponent } from './features/accountcenter/accountsecurity/accountsecurity.component';
import { DicordIntegrationComponent } from './features/accountcenter/dicord-integration/dicord-integration.component';
import { CommingSoonComponent } from './shared/comming-soon/comming-soon.component';
// import { AdminCenterComponent } from './features/admin-center/admin-center.component';

// const userConnectedPrefix: string = "connected/"

export enum AppRoutes {
  HOME = 'home',
  LOGIN = 'login',
  LOGOUT = 'disconnect',
  ACCOUNTCENTER = 'account',
  CONTACTUS = 'contactus',
  ADMINCENTER = 'admincenter',
  ACCOUNTSETTINGS = `personnal`,
  ACCOUNTSETTINGS_FULLPATH = `${AppRoutes.ACCOUNTCENTER}/${AppRoutes.ACCOUNTSETTINGS}`,
  ACCOUNTSECURITY ='security',
  ACCOUNTSECURITY_FULLPATH = `${AppRoutes.ACCOUNTCENTER}/${AppRoutes.ACCOUNTSECURITY}`,
  DISCORDINTEGRATION = 'discord-integration',
  DISCORDINTEGRATION_FULLPATH = `${AppRoutes.ACCOUNTCENTER}/${AppRoutes.DISCORDINTEGRATION}`,
  NOTIFICATIONS = 'notifications',
  CONTACTADMIN = 'contact-admin',
  NOTFOUND = '**',
}

export const routes: Routes = [
  {
    path: AppRoutes.LOGIN,
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: AppRoutes.LOGIN,
    pathMatch: 'full',
  },
  {
    path: AppRoutes.ACCOUNTCENTER,
    redirectTo: `${AppRoutes.ACCOUNTCENTER}/${AppRoutes.ACCOUNTSETTINGS}`,
    pathMatch: 'full',
  },
  {
    path: AppRoutes.LOGOUT,
    component: LogoutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.HOME,
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  // {
  //   path: AppRoutes.ADMINCENTER,
  //   component: AdminCenterComponent,
  //   canActivate: [AuthGuard],
  // },
  {
    path: AppRoutes.ACCOUNTCENTER,
    component: AccountCenterComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: AppRoutes.ACCOUNTSETTINGS,
        component: AccountInformationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: AppRoutes.ACCOUNTSECURITY,
        component: AccountSecurityComponent,
        canActivate: [AuthGuard],
      },
      {
        path: AppRoutes.DISCORDINTEGRATION,
        component: DicordIntegrationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: AppRoutes.NOTIFICATIONS,
        component: CommingSoonComponent,
        canActivate: [AuthGuard],
      },
      {
        path: AppRoutes.CONTACTADMIN,
        component: CommingSoonComponent,
        canActivate: [AuthGuard],
      },
      {
        path: AppRoutes.NOTFOUND,
        component: NotFoundComponent,
        canActivate: [AuthGuard],
      },
    ],

  },
  {
    path: AppRoutes.NOTFOUND,
    component: NotFoundComponent,
  },
];

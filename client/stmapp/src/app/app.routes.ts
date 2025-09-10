import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';

// const userConnectedPrefix: string = "connected/"

export enum AppRoutes {
    HOME = "connected/home",
    LOGIN = "login"
}

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'connected',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        children: [
            {
                path: 'home',
                component: HomeComponent,
                canActivate: [AuthGuard]
            },
        ]
    },
    {
        path: '**',
        component: NotFoundComponent
    },
    
];

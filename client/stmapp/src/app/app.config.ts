import { ApplicationConfig, importProvidersFrom, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { JwtModule, JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';



import { routes } from './app.routes';
import { AuthService } from './core/services/auth/auth.service';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    JwtHelperService,
    importProvidersFrom(
      JwtModule.forRoot(
        {
          config: {
            tokenGetter: () => inject(AuthService).getToken(),
            allowedDomains: [environment.API_DOMAIN],
            disallowedRoutes: [
              `${environment.API_URL_BASE_ROUTE_V1}/auth/login`,
              `${environment.API_URL_BASE_ROUTE_V1}/auth/register`,
            ],
          },
        }
      )
    ),
    provideHttpClient(
      withInterceptorsFromDi()
    )
  ]
};

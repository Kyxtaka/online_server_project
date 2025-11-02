import { ApplicationConfig, importProvidersFrom, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { JwtModule, JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';



import { routes } from './app.routes';
import { AuthService } from './core/services/auth/auth.service';

import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    JwtHelperService,
    importProvidersFrom(
      JwtModule.forRoot(
        {
          config: {
            // tokenGetter: () => inject(AuthService).getToken(),
            tokenGetter: () => {
              const cookieService = inject(CookieService);
              const token: string | null = cookieService.get('token_name');
              return token;
            },
            // allowedDomains: [environment.API_DOMAIN],
            allowedDomains: ["stm-api.hikarizsu.fr", "stm-api-test.hikarizsu.fr"],
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

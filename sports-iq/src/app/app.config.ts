import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { environment } from '../environments/environment';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideClientHydration(withEventReplay()),
    provideAuth0({
      domain: environment.issuer,
      clientId: environment.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: environment.audience,
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: environment.baseUrl + '/api/*',
            tokenOptions: {
              authorizationParams: {
                audience: environment.audience,
              },
            },
          },
        ],
      },
    }),
  ],
};

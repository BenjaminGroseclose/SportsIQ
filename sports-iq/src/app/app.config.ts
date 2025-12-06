import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from '../libs/auth';
import { OAuthModule, OAuthModuleConfig } from 'angular-oauth2-oidc';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { PLATFORM_ID, inject as injectFn } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAppInitializer(() => {
      const platformId = injectFn(PLATFORM_ID);
      const isBrowser = isPlatformBrowser(platformId);

      if (!isBrowser) {
        // Skip OAuth configuration on the server to avoid window usage
        return Promise.resolve(null);
      }

      const oauthService = inject(OAuthService);

      const authConfig: AuthConfig = {
        issuer: environment.issuer,
        clientId: environment.clientId,
        redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
        responseType: environment.responseType,
        scope: environment.scope,
        showDebugInformation: environment.showDebugInformation,
      };

      oauthService.configure(authConfig);
      return oauthService.loadDiscoveryDocumentAndTryLogin();
    }),
    importProvidersFrom(OAuthModule.forRoot()),
    {
      provide: OAuthModuleConfig,
      useFactory: () => ({
        resourceServer: {
          allowedUrls: [environment.baseUrl],
          sendAccessToken: true,
        },
      }),
    },
  ],
};

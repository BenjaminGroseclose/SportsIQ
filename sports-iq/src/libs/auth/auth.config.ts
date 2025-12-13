import { environment } from '@sports-iq/environments/environment';
import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: environment.issuer,
  redirectUri: window.location.origin,
  clientId: environment.clientId,
  scope: environment.scope,
  showDebugInformation: environment.showDebugInformation,
  customQueryParams: {
    audience: environment.audience,
  },
};

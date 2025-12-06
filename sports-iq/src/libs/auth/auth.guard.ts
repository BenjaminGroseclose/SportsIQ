import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private readonly oauthService = inject(OAuthService);
    private readonly platformID = inject(PLATFORM_ID);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    // -----------------------------------------------------------------------
    // 1. SERVER-SIDE CHECK
    // -----------------------------------------------------------------------
    // If we are on the server, we MUST return true.
    // If we return false, the server stops rendering and sends a blank page.
    // If we try to redirect, the server build might hang or error out.
    if (!isPlatformBrowser(this.platformID)) {
      return true;
    }

    // -----------------------------------------------------------------------
    // 2. CLIENT-SIDE CHECK
    // -----------------------------------------------------------------------
    // Now we are in the browser. We can safely check for the token.
    
    const hasIdToken = this.oauthService.hasValidIdToken();
    const hasAccessToken = this.oauthService.hasValidAccessToken();

    if (hasIdToken && hasAccessToken) {
      return true;
    }

    // -----------------------------------------------------------------------
    // 3. HANDLE UNAUTHENTICATED USER
    // -----------------------------------------------------------------------
    // Force login. 
    // Note: We pass the target URL so we can redirect back after login.
    // (Ensure your auth config supports 'state' or you handle this manually)
    this.oauthService.initLoginFlow(state.url);
    
    return false;
  }
}
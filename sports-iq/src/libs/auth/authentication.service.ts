import * as Cookies from 'es-cookie';
import { computed, inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
import { AuthConfig, OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { AccountService } from '../../app/services/account.service';
import { IAccount } from '../../app/models';
import { Environment } from '../models/environment.type';
import { environment } from '@sports-iq/environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private oauthService = inject(OAuthService);
  private accountService = inject(AccountService);
  private authConfig: AuthConfig | null;
  private readonly env: Environment;
  private readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

  public user = signal<IAccount | null>(null);
  public isLoggedIn = computed<boolean>(() => this.user() !== null);

  constructor() {
    this.env = environment;

    if (this.isBrowser) {
      this.authConfig = {
        issuer: this.env.issuer,
        clientId: this.env.clientId,
        redirectUri: window.location.origin,
        responseType: this.env.responseType,
        scope: this.env.scope,
        showDebugInformation: this.env.showDebugInformation,
      };
    } else {
      this.authConfig = null;
    }
  }

  initialize(): void {
    if (!this.isBrowser) {
      return;
    }

    this.configure();

    const userProfile = this.getUserProfile();
    if (userProfile) {
      this.accountService.getUser(userProfile.email).subscribe((user) => this.user.set(user));
    }
  }

  configure(): void {
    if (!this.isBrowser || !this.authConfig) {
      return;
    }

    this.oauthService.configure({
      issuer: this.authConfig.issuer,
      redirectUri: this.authConfig.redirectUri,
      clientId: this.authConfig.clientId,
      scope: this.authConfig.scope,
    });

    this.oauthService.loadDiscoveryDocumentAndTryLogin();

    this.oauthService.events.subscribe((event: OAuthEvent) => {
      if (event.type === 'token_received') {
        const userProfile = this.getUserProfile();
        if (!userProfile) {
          return;
        }

        const accessToken = this.oauthService.getAccessToken();
        const idToken = this.oauthService.getIdToken();
        const refreshToken = this.oauthService.getRefreshToken();

        Cookies.set('id_token', idToken);
        Cookies.set('access_token', accessToken);
        Cookies.set('refresh_token', refreshToken);

        this.getUser(userProfile);
      } else {
        // TODO: Handle other events as needed
      }
    });
  }

  login(): void {
    if (!this.isBrowser) {
      return;
    }

    // If we already have identity claims, load the user; otherwise start
    // the OAuth login flow. No reliance on client-side storage.
    const userProfile = this.getUserProfile();
    if (!userProfile) {
      this.oauthService.initLoginFlow();
    } else {
      this.getUser(userProfile);
    }
  }

  getUser(userProfile: any): void {
    this.accountService.getUser(userProfile.email).subscribe({
      next: (user) => this.user.set(user),
      error: () => this.createAccount(),
    });
  }

  createAccount(): void {
    if (!this.isBrowser) {
      return;
    }

    const userProfile = this.getUserProfile();
    if (!userProfile) {
      return;
    }

    const account: IAccount = {
      accountID: 0,
      username: userProfile.email,
      displayName: userProfile.name,
      email: userProfile.email,
      profilePictureUrl: userProfile.picture, // TODO: Implement a random profile picture
      lastLogin: new Date(),
      isActive: true,
      createDate: new Date(),
      lastModified: null,
    };

    this.accountService.createAccount(account).subscribe((user) => this.user.set(user));
  }

  logout(): void {
    if (!this.isBrowser) {
      this.user.set(null);
      return;
    }
    this.oauthService.logOut();
    this.user.set(null);
  }

  getUserProfile(): any {
    return this.oauthService.getIdentityClaims();
  }
}

import * as Cookies from 'es-cookie';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthConfig, OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { AppSettings, AppSettingsService, StorageService } from '../services';
import { AccountService } from '../../app/services/account.service';
import { IAccount } from '../../app/models';

const SESSION_KEY: string = 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private appSettingsService = inject(AppSettingsService);
  private oauthService = inject(OAuthService);
  private accountService = inject(AccountService);
  private authConfig: AuthConfig;
  private readonly storageService = new StorageService();
  private readonly settings: AppSettings;

  public user = signal<IAccount | null>(null);
  public isLoggedIn = computed<boolean>(() => this.user() !== null);

  constructor() {
    this.settings = this.appSettingsService.getSettings();

    this.authConfig = {
      issuer: this.settings.issuer,
      clientId: this.settings.clientId,
      redirectUri: window.location.origin,
      responseType: this.settings.responseType,
      scope: this.settings.scope,
      showDebugInformation: this.settings.showDebugInformation,
    };
  }

  init(): void {
    if (!this.storageService.hasKey(SESSION_KEY)) {
      this.configure();
    } else {
      const userProfile = this.getUserProfile();

      this.accountService
        .getUser(userProfile.email)
        .subscribe((user) => this.user.set(user));
    }
  }

  configure(): void {
    this.oauthService.configure({
      issuer: this.authConfig.issuer,
      redirectUri: this.authConfig.redirectUri,
      clientId: this.authConfig.clientId,
      scope: this.authConfig.scope
    });

    this.oauthService.loadDiscoveryDocumentAndTryLogin();

    this.oauthService.events.subscribe((event: OAuthEvent) => {
      if (event.type === 'token_received') {
        const userProfile = this.getUserProfile();

        const accessToken = this.oauthService.getAccessToken();
        const idToken = this.oauthService.getIdToken();
        const refreshToken = this.oauthService.getRefreshToken();

        Cookies.set('id_token', idToken);
        Cookies.set('access_token', accessToken);
        Cookies.set('refresh_token', refreshToken);

        this.storageService.set(SESSION_KEY, userProfile);

        this.getUser(userProfile);
      } else {
        // TODO: Handle other events as needed
      }
    });
  }

  login(): void {
    if (!this.storageService.hasKey(SESSION_KEY)) {
      this.oauthService.initLoginFlow();
    } else {
      const userProfile = this.getUserProfile();

      this.getUser(userProfile);
    }
  }

  getUser(userProfile: any): void {

    this.accountService.getUser(userProfile.email).subscribe({
      next: (user) => this.user.set(user),
      error: () => this.createAccount()
    });
  }

  createAccount(): void {
    const userProfile = this.getUserProfile();

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

    this.accountService
      .createAccount(account)
      .subscribe((user) => this.user.set(user));
  }

  logout(): void {
    this.oauthService.logOut();
    this.user.set(null);
    this.storageService.remove(SESSION_KEY);
  }

  getUserProfile(): any {
    return this.oauthService.getIdentityClaims();
  }
}

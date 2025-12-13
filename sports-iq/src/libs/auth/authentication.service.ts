import * as Cookies from 'es-cookie';
import { inject, Injectable } from '@angular/core';
import { AccountService } from '@sports-iq/app/services/account.service';
import { AccountStateService } from '@sports-iq/app/state/account-state.service';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { map, take } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { environment } from '@sports-iq/environments/environment';
import { IAccount } from '@sports-iq/app/models';
import { SnackbarService } from '../services';

const SESSION_KEY: string = 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private oauthService = inject(OAuthService);
  private accountService = inject(AccountService);
  private accountStateService = inject(AccountStateService);
  private storageService = new StorageService();
  private snackbarService = inject(SnackbarService);

  constructor() {}

  public init(): void {
    if (!this.storageService.hasKey(SESSION_KEY)) {
      this.configure();
    } else {
      this.accountService.getUser().subscribe((user) => this.accountStateService.setAccount(user));
    }
  }

  private configure(): void {
    this.oauthService.configure({
      issuer: environment.issuer,
      redirectUri: window.location.origin,
      clientId: environment.clientId,
      scope: environment.scope,
      showDebugInformation: environment.showDebugInformation,
      customQueryParams: {
        audience: environment.audience,
      },
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

        this.getUser();
      }
    });
  }

  login(): void {
    if (!this.storageService.hasKey(SESSION_KEY)) {
      this.oauthService.initLoginFlow();
    } else {
      this.getUser();
    }
  }

  logout(): void {
    this.oauthService.logOut();
    this.accountStateService.clearState();
    this.storageService.remove(SESSION_KEY);
  }

  getUser(): void {
    this.accountService.getUser().subscribe({
      next: (user) => this.accountStateService.setAccount(user),
      error: () => this.createAccount(),
    });
  }

  private getUserProfile(): any {
    return this.oauthService.getIdentityClaims();
  }

  private createAccount(): void {
    const user = this.getUserProfile();

    if (user?.email === undefined) {
      throw new Error('User email is undefined');
    }

    if (user.sub === undefined) {
      throw new Error('User ID is undefined');
    }

    const account: IAccount = {
      accountID: 0,
      username: user.email,
      displayName: user.name ?? user.email,
      email: user.email,
      userID: user.sub,
      profilePictureUrl: user.picture ?? '',
      lastLogin: new Date(),
      isActive: true,
      createDate: new Date(),
      lastModified: null,
    };

    console.log('Creating account with data:', account);

    this.accountService
      .createAccount(account)

      .subscribe({
        next: (createdAccount) => {
          this.accountStateService.setAccount(createdAccount);
          this.snackbarService.showSuccess('Account created successfully!');
        },
        error: (error) => {
          console.error(error);
          this.snackbarService.showError(`Failed to create account, please try again.`);
        },
      });
  }
}

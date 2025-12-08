import { computed, inject, Injectable } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { IAccount } from '../models';
import { BaseState, SnackbarService, StateBase } from '@sports-iq/libs';
import { distinctUntilChanged, map, switchMap, take, tap } from 'rxjs';
import { AccountService } from '../services/account.service';

type UserState = BaseState & {
  account: IAccount | null;
  isAuthenticated: boolean;
};

const initialUserState: UserState = {
  account: null,
  isAuthenticated: false,
  loading: false,
  loaded: false,
  error: null,
};

@Injectable({
  providedIn: 'root',
})
export class AccountStateService extends StateBase<UserState> {
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountService);
  private readonly snackbarService = inject(SnackbarService);

  public account = computed(() => this.state().account);
  public profilePictureUrl = computed<string | null>(
    () => this.account()?.profilePictureUrl || null,
  );

  public hasAccount = computed<boolean>(() => this.state().account !== null);

  constructor() {
    super(initialUserState);

    this.authService.isAuthenticated$
      .pipe(
        distinctUntilChanged(),
        tap((isAuthenticated) =>
          this.patchState({ isAuthenticated, loading: true, error: null, loaded: false }),
        ),
        switchMap(() => this.accountService.getUser()),
      )
      .subscribe({
        next: (account) => {
          console.log('Fetched account:', account);
          if (account) {
            this.patchState({ account, loading: false, loaded: true, error: null });
          }
        },
        error: (error) => {
          if (error.state === 404) {
            this.createAccount();
          } else {
            this.patchState({ loading: false, loaded: false, error: error.message });
            console.error(error);
            this.snackbarService.showError(`Failed to load user account, please try again.`);
          }
        },
      });
  }

  private createAccount(): void {
    this.authService.user$
      .pipe(
        take(1),
        map((user) => {
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

          return account;
        }),
        switchMap((account) => this.accountService.createAccount(account)),
      )
      .subscribe({
        next: (createdAccount) => {
          this.patchState({ account: createdAccount });
          this.snackbarService.showSuccess('Account created successfully!');
        },
        error: (error) => {
          console.error(error);
          this.snackbarService.showError(`Failed to create account, please try again.`);
        },
      });
  }
}

import { computed, inject, Injectable } from '@angular/core';
import { IAccount } from '../models';
import { BaseState, SnackbarService, StateBase } from '@sports-iq/libs';
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
  private readonly accountService = inject(AccountService);
  private readonly snackbarService = inject(SnackbarService);

  public account = computed(() => this.state().account);
  public profilePictureUrl = computed<string | null>(
    () => this.account()?.profilePictureUrl || null,
  );

  public hasAccount = computed<boolean>(() => this.state().account !== null);

  constructor() {
    super(initialUserState);
  }

  setAccount(account: IAccount): void {
    this.patchState({ account });
  }
}

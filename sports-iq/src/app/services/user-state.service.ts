import { computed, inject, Injectable } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { IAccount } from '../models';
import { StateBase } from '@sports-iq/libs';

type UserState = {
  user: User | null;
  account: IAccount | null;
  isAuthenticated: boolean;
  loading: boolean;
  loaded: boolean;
};

const initialUserState: UserState = {
  user: null,
  account: null,
  isAuthenticated: false,
  loading: false,
  loaded: false,
};

@Injectable({
  providedIn: 'root',
})
export class UserStateService extends StateBase<UserState> {
  private readonly authService = inject(AuthService);

  public profilePictureUrl = computed<string | null>(
    () => this.state().account?.profilePictureUrl || null,
  );

  constructor() {
    super(initialUserState);

    this.authService.user$.subscribe((user) => {
      console.log(user);
      this.patchState({ user });
    });
  }
}

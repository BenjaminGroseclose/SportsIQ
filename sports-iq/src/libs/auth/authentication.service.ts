// import * as Cookies from 'es-cookie';
// import { computed, inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
// import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
// import { AccountService } from '../../app/services/account.service';
// import { IAccount } from '../../app/models';
// import { isPlatformBrowser } from '@angular/common';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthenticationService {
//   private oauthService = inject(OAuthService);
//   private accountService = inject(AccountService);
//   private readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

//   public user = signal<IAccount | null>(null);
//   public isLoggedIn = computed<boolean>(() => this.user() !== null);

//   constructor() {
//     // OAuth is already configured in app.config.ts
//   }

//   initialize(): void {
//     if (!this.isBrowser) {
//       return;
//     }

//     console.log('Initializing AuthenticationService');

//     // Just subscribe to events, don't reconfigure
//     this.oauthService.events.subscribe((event: OAuthEvent) => {
//       if (event.type === 'token_received') {
//         const userProfile = this.getUserProfile();
//         if (!userProfile) {
//           return;
//         }

//         console.log('Token received, user profile:', userProfile);

//         const accessToken = this.oauthService.getAccessToken();
//         const idToken = this.oauthService.getIdToken();
//         const refreshToken = this.oauthService.getRefreshToken();

//         Cookies.set('id_token', idToken);
//         Cookies.set('access_token', accessToken);
//         Cookies.set('refresh_token', refreshToken);

//         console.log('Tokens set in cookies:', { idToken, accessToken, refreshToken });

//         this.getUser(userProfile);
//       }
//     });

//     const userProfile = this.getUserProfile();
//     if (userProfile) {
//       this.accountService.getUser(userProfile.email).subscribe((user) => this.user.set(user));
//     }
//   }

//   login(): void {
//     if (!this.isBrowser) {
//       return;
//     }

//     const userProfile = this.getUserProfile();
//     if (!userProfile) {
//       this.oauthService.initLoginFlow();
//     } else {
//       this.getUser(userProfile);
//     }
//   }

//   getUser(userProfile: any): void {
//     this.accountService.getUser(userProfile.email).subscribe({
//       next: (user) => this.user.set(user),
//       error: () => this.createAccount(),
//     });
//   }

//   createAccount(): void {
//     if (!this.isBrowser) {
//       return;
//     }

//     const userProfile = this.getUserProfile();
//     if (!userProfile) {
//       return;
//     }

//     const account: IAccount = {
//       accountID: 0,
//       username: userProfile.email,
//       displayName: userProfile.name,
//       email: userProfile.email,
//       profilePictureUrl: userProfile.picture,
//       lastLogin: new Date(),
//       isActive: true,
//       createDate: new Date(),
//       lastModified: null,
//     };

//     this.accountService.createAccount(account).subscribe((user) => this.user.set(user));
//   }

//   logout(): void {
//     if (!this.isBrowser) {
//       this.user.set(null);
//       return;
//     }
//     this.oauthService.logOut();
//     this.user.set(null);
//   }

//   getUserProfile(): any {
//     return this.oauthService.getIdentityClaims();
//   }
// }

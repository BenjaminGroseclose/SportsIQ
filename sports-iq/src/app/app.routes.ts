import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Account } from './pages/account/account';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'account',
    component: Account,
    canActivate: [AuthGuard],
  },
];

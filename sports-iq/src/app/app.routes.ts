import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Account } from './pages/account/account';
import { AuthGuard } from '@auth0/auth0-angular';
import { Analytics } from './pages/analytics/analytics';
import { Rankings } from './pages/rankings/rankings';
import { Matchups } from './pages/matchups/matchups';
import { FantasyCenter } from './pages/fantasy-center/fantasy-center';
import { ArmchairGM } from './pages/armchair-gm/armchair-gm';

export const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'account',
    component: Account,
    canActivate: [AuthGuard],
  },
  {
    path: 'analytics',
    component: Analytics
  },
  {
    path: 'fantasy',
    component: FantasyCenter
  },
  {
    path: 'armchair-gm',
    component: ArmchairGM
  },
  {
    path: 'rankings',
    component: Rankings
  },
  {
    path: 'matchups',
    component: Matchups
  }
];

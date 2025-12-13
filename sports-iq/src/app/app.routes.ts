import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Account } from './pages/account/account';
import { Analytics } from './pages/analytics/analytics';
import { Rankings } from './pages/rankings/rankings';
import { Matchups } from './pages/matchups/matchups';
import { FantasyCenter } from './pages/fantasy-center/fantasy-center';
import { ArmchairGM } from './pages/armchair-gm/armchair-gm';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
    data: { title: 'Home' },
  },
  {
    path: 'account',
    component: Account,
    // canActivate: [AuthGuard],
    data: { title: 'Account' },
  },
  {
    path: 'analytics',
    component: Analytics,
    data: { title: 'Analytics Lab' },
  },
  {
    path: 'fantasy',
    component: FantasyCenter,
    data: { title: 'Fantasy Center' },
  },
  {
    path: 'armchair-gm',
    component: ArmchairGM,
    data: { title: 'Armchair GM' },
  },
  {
    path: 'rankings',
    component: Rankings,
    data: { title: 'Rankings' },
  },
  {
    path: 'matchups',
    component: Matchups,
    data: { title: 'Matchups' },
  },
];

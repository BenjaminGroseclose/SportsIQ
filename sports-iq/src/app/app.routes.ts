import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Account } from './pages/account/account';
import { Analytics } from './pages/analytics/analytics';
import { Rankings } from './pages/rankings/rankings';
import { Matchups } from './pages/matchups/matchups';
import { FantasyCenter } from './pages/fantasy-center/fantasy-center';
import { SportHome } from './pages/sport-home/sport-home';
import { TradeMachine } from './pages/trade-machine/trade-machine';

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
    path: ':sport',
    component: SportHome,
    children: [
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
        path: 'trade-machine',
        component: TradeMachine,
        data: { title: 'Trade Machine' },
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
    ],
  },
];

import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Spacer } from '@sports-iq/libs/components';
import { MatListModule } from '@angular/material/list';
import { NavItem } from '@sports-iq/libs/components/nav-item/nav-item';
import { INavItem } from '@sports-iq/libs/models/nav-item.type';
import { Router } from '@angular/router';
import { AccountStateService } from '@sports-iq/app/state/account-state.service';
import { AuthenticationService } from '@sports-iq/libs/auth/authentication.service';

@Component({
  selector: 'siq-sidenav',
  imports: [CommonModule, Spacer, MatButtonModule, MatIconModule, MatListModule, NavItem],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly userStateService = inject(AccountStateService);

  isExpanded = signal<boolean>(false);

  isAuthenticated = computed<boolean>(() => this.userStateService.state().isAuthenticated);
  hasAccount = computed<boolean>(() => this.userStateService.hasAccount());
  profilePictureUrl = computed<string | undefined>(
    () => this.userStateService.profilePictureUrl() || undefined,
  );
  username = computed<string>(() => this.userStateService.state().account?.username || 'Guest');

  topNavItems = computed<INavItem[]>(() => {
    const items: INavItem[] = [];

    items.push(
      {
        icon: 'home',
        title: 'Home',
        action: () => this.navigate('/'),
      },
      {
        icon: 'science',
        title: 'Analytics',
        action: () => this.navigate('/analytics'),
      },
      {
        icon: 'emoji_events',
        title: 'Fantasy',
        action: () => this.navigate('/fantasy'),
      },
      {
        icon: 'business_center',
        title: 'Armchair GM',
        action: () => this.navigate('/armchair-gm'),
      },
      {
        icon: 'how_to_vote',
        title: 'Rankings',
        action: () => this.navigate('/rankings'),
      },
      {
        icon: 'preview',
        title: 'Matchups',
        action: () => this.navigate('/matchups'),
      },
    );

    return items;
  });

  bottomNavItems = computed<INavItem[]>(() => {
    const isAuthenticated = this.isAuthenticated();
    const isExpanded = this.isExpanded();
    const items: INavItem[] = [];

    if (isAuthenticated) {
    } else {
      items.push({
        icon: 'login',
        title: 'Login',
        action: () => this.login(),
      });
    }

    if (isExpanded) {
      items.push({
        icon: 'keyboard_double_arrow_left',
        title: 'Collapse',
        action: () => this.isExpanded.set(false),
      });
    } else {
      items.push({
        icon: 'keyboard_double_arrow_right',
        title: 'Expand',
        action: () => this.isExpanded.set(true),
      });
    }

    return items;
  });

  login(): void {
    this.authenticationService.login();
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}

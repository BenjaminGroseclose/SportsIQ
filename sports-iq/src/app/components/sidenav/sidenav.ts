import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Spacer } from '@sports-iq/libs/components';
import { MatListModule } from '@angular/material/list';
import { AuthenticationService } from '@sports-iq/libs';
import { NavItem } from '@sports-iq/libs/components/nav-item/nav-item';
import { INavItem } from '@sports-iq/libs/models/nav-item.type';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'siq-sidenav',
  imports: [CommonModule, Spacer, MatButtonModule, MatIconModule, MatListModule, NavItem],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav {
  private readonly authenticationService = inject(AuthService);
  private readonly router = inject(Router);

  isExpanded = signal<boolean>(false);

  // user = this.authenticationService.user;
  // isLoggedIn = this.authenticationService.isLoggedIn;
  // username = computed(() => this.user()?.username);

  topNavItems = computed<INavItem[]>(() => {
    const items: INavItem[] = [];

    items.push({
      icon: 'home',
      title: 'Home',
      action: () => this.navigate('/'),
    });

    return items;
  });

  bottomNavItems = computed<INavItem[]>(() => {
    const isLoggedIn = this.isLoggedIn();
    const isExpanded = this.isExpanded();
    const items: INavItem[] = [];

    if (isLoggedIn) {
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
    this.authenticationService.loginWithRedirect();
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}

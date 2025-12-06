import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Spacer } from '@sports-iq/libs/components';
import { MatListModule } from '@angular/material/list';
import { AuthenticationService } from '@sports-iq/libs';

@Component({
  selector: 'siq-sidenav',
  imports: [CommonModule, Spacer, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav {
  private readonly authenticationService = inject(AuthenticationService);

  isExpanded = signal<boolean>(false);

  user = this.authenticationService.user;
  isLoggedIn = this.authenticationService.isLoggedIn;
  username = computed(() => this.user()?.username);

  login(): void {
    this.authenticationService.login();
  }
}

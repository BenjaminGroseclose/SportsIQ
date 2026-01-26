import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Sidenav } from './components/sidenav/sidenav';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthenticationService } from '@sports-iq/libs/auth/authentication.service';
import { Header } from './components/header/header';
import { CoreStateService } from './state/core-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidenav],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly coreStateService = inject(CoreStateService);

  private readonly currentRoute = signal<string | null>(null);

  public showFilters = computed(() => !this.currentRoute()?.includes('home'));

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.currentRoute.set(this.router.url));
  }

  ngOnInit(): void {
    this.authenticationService.initialize();
    this.coreStateService.initialize();
  }
}

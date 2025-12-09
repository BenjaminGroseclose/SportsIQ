import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Sidenav } from './components/sidenav/sidenav';
import { Filters } from "./components/filters/filters";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidenav, Filters],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router)

  private currentRoute = signal<string | null>(null);

  public showFilters = computed(() => !this.currentRoute()?.includes('home')
    
  )

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe(urlSegments => {
      console.log('Current URL segments:', this.router.url);
      this.currentRoute.set(this.router.url);
    });
  }
}

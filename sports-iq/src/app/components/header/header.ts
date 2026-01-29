import { Component, inject } from '@angular/core';
import { Spacer } from '@sports-iq/libs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import { AppContextService } from '@sports-iq/app/state';

@Component({
  selector: 'siq-header',
  imports: [Spacer],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private appContextService = inject(AppContextService);

  sport = this.appContextService.sport;

  private title$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    startWith(null),
    map(() => {
      let r: ActivatedRoute | null = this.route;
      while (r?.firstChild) {
        r = r.firstChild;
      }
      const snapshot = r?.snapshot;
      const dataTitle = snapshot?.data?.['title'] as string | undefined;
      return dataTitle ?? this.fallbackTitle();
    }),
  );

  pageTitle = toSignal(this.title$, { initialValue: this.fallbackTitle() });

  private fallbackTitle(): string {
    const url = this.router.url || '';
    if (url.startsWith('/analytics')) return 'Analytics Lab';
    if (url.startsWith('/fantasy')) return 'Fantasy Center';
    if (url.startsWith('/armchair-gm')) return 'Armchair GM';
    if (url.startsWith('/rankings')) return 'Rankings';
    if (url.startsWith('/matchups')) return 'Matchups';
    if (url.startsWith('/account')) return 'Account';
    return 'Home';
  }
}

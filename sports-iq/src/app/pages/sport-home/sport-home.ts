import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { Header } from '@sports-iq/app/components/header/header';
import { AppContextService } from '@sports-iq/app/state/app-context.service';
import { CoreStateService } from '@sports-iq/app/state/core-state.service';
import { combineLatest } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'siq-sport-home',
  templateUrl: './sport-home.html',
  styleUrl: './sport-home.scss',
  standalone: true,
  imports: [RouterOutlet, Header],
})
export class SportHome implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly appContextService = inject(AppContextService);
  private readonly coreStateService = inject(CoreStateService);

  coreLoading = this.coreStateService.loading;

  ngOnInit(): void {
    combineLatest([toObservable(this.coreStateService.loaded), this.route.paramMap])
      .pipe(
        filter(([loaded]) => loaded),
        takeUntilDestroyed(),
        map(([_, params]) => params.get('sport')!),
        distinctUntilChanged(),
      )
      .subscribe((sport) => {});
  }
}

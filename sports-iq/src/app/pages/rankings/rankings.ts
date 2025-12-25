import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { IPlayerRanking } from '@sports-iq/app/models';
import { PlayerRankingService } from '@sports-iq/app/services';
import { FilterStateService } from '@sports-iq/app/state/filter-state.service';
import { switchMap } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { RankingRow } from './ranking-row/ranking-row';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'siq-rankings',
  imports: [
    CommonModule,
    RankingRow,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './rankings.html',
  styleUrl: './rankings.scss',
})
export class Rankings {
  private readonly playerRankingService = inject(PlayerRankingService);
  private readonly filterStateService = inject(FilterStateService);

  private sportsID = this.filterStateService.getSelectedOption('sports');

  public playerRankings = signal<IPlayerRanking[]>([]);

  constructor() {
    toObservable(this.sportsID)
      .pipe(
        takeUntilDestroyed(),
        filter((id) => id !== null),
        switchMap((id) => this.playerRankingService.getRankings(id)),
      )
      .subscribe((playerRankings) => this.playerRankings.set(playerRankings));
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { IPlayerRanking } from '@sports-iq/app/models';
import { PlayerRankingService } from '@sports-iq/app/services';
import { switchMap } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { RankingRow } from './ranking-row/ranking-row';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppContextService } from '@sports-iq/app/state/app-context.service';

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
  private readonly appContextService = inject(AppContextService);

  public readonly sportsID = this.appContextService.sportID;

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

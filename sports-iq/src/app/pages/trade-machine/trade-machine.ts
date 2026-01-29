import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { ITeam } from '@sports-iq/app/models';
import { CoreService } from '@sports-iq/app/services';
import { AppContextService } from '@sports-iq/app/state/app-context.service';
import { PlayerStateService } from '@sports-iq/app/state/player-state.service';
import { filter, switchMap, take } from 'rxjs';

@Component({
  selector: 'siq-trade-machine',
  imports: [MatCardModule],
  templateUrl: './trade-machine.html',
  styleUrl: './trade-machine.scss',
})
export class TradeMachine {
  private readonly playerStateService = inject(PlayerStateService);
  private readonly appContextService = inject(AppContextService);
  private readonly coreService = inject(CoreService);

  players = this.playerStateService.players;
  sport = this.appContextService.sport;

  teams = signal<ITeam[]>([]);

  constructor() {
    toObservable(this.sport)
      .pipe(
        takeUntilDestroyed(),
        filter((x) => !!x),
        switchMap((sport) => this.coreService.getTeams(sport!.sportID)),
      )
      .subscribe((teams) => this.teams.set(teams));
  }
}

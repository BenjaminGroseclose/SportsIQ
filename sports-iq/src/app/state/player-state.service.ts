import { computed, effect, inject, Injectable } from '@angular/core';
import { BaseState, StateServiceBase } from '@sports-iq/libs/services/state-base.service';
import { PlayerService } from '../services';
import { IPlayer } from '../models';
import { AppContextService } from './app-context.service';

type PlayerState = BaseState & {
  players: IPlayer[];
  totalCount?: number;
  page: number;
  pageSize?: number;
};

const initialPlayerState: PlayerState = {
  players: [],
  totalCount: 0,
  pageSize: 100,
  page: 1,
  loading: false,
  loaded: false,
  error: null,
};

@Injectable({
  providedIn: 'root',
})
export class PlayerStateService extends StateServiceBase<PlayerState> {
  private readonly playerService = inject(PlayerService);
  private readonly appContext = inject(AppContextService);

  players = computed(() => this.state().players);
  totalCount = computed(() => this.state().totalCount);
  pageSize = computed(() => this.state().pageSize);
  page = computed(() => this.state().page);

  constructor() {
    super(initialPlayerState);

    // React to sport/season context changes and load players accordingly
    effect((onCleanup) => {
      const sportID = this.appContext.sportID();
      const seasonID = this.appContext.seasonID();

      console.log('PlayerStateService detected context change:', { sportID, seasonID });

      // If either context value is missing, clear state
      if (sportID === null || seasonID === null) {
        this.patchState({ players: [], loading: false, loaded: false, error: null });
        return;
      }

      this.patchState({ loading: true, error: null });

      const pageSize = this.pageSize();
      const page = this.page();

      const sub = this.playerService
        .getPlayers({
          sportId: sportID,
          seasonId: seasonID ?? undefined,
          includeRatings: true,
          pageSize,
          page,
        })
        .subscribe({
          next: (response) => {
            this.patchState({
              players: response.items,
              totalCount: response.totalCount,
              loading: false,
              loaded: true,
              error: null,
            });
          },
          error: (err) => {
            this.patchState({ loading: false, loaded: false, error: err });
          },
        });

      onCleanup(() => sub.unsubscribe());
    });
  }
}

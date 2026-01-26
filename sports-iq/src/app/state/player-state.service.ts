import { computed, inject, Injectable } from '@angular/core';
import { BaseState, StateServiceBase } from '@sports-iq/libs/services/state-base.service';
import { PlayerService } from '../services';
import { IPlayer } from '../models';

type PlayerState = BaseState & {
  players: IPlayer[];
};

const initialPlayerState: PlayerState = {
  players: [],
  loading: false,
  loaded: false,
  error: null,
};

@Injectable({
  providedIn: 'root',
})
export class PlayerStateService extends StateServiceBase<PlayerState> {
  private readonly playerService = inject(PlayerService);

  players = computed(() => this.state().players);

  constructor() {
    super(initialPlayerState);
  }

  initialize(sportID: number): void {
    this.patchState({ loading: true });

    this.playerService.getPlayersBySport(sportID, true).subscribe((players) => {
      this.patchState({
        players: players,
        loading: false,
        loaded: true,
        error: null,
      });
    });
  }
}

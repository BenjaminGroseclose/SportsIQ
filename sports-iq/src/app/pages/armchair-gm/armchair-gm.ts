import { Component, inject } from '@angular/core';
import { PlayerStateService } from '@sports-iq/app/state/player-state.service';

@Component({
  selector: 'siq-armchair-gm',
  imports: [],
  templateUrl: './armchair-gm.html',
  styleUrl: './armchair-gm.scss',
})
export class ArmchairGM {
  private readonly playerStateService = inject(PlayerStateService);

  players = this.playerStateService.players;
}

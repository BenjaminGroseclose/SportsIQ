import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PlayerStateService } from '@sports-iq/app/state/player-state.service';

@Component({
  selector: 'siq-armchair-gm',
  imports: [],
  templateUrl: './armchair-gm.html',
  styleUrl: './armchair-gm.scss',
})
export class ArmchairGM implements OnInit {
  private readonly stateService = inject(PlayerStateService);

  constructor() {}

  ngOnInit(): void {
    this.stateService.initialize(5);
  }
}

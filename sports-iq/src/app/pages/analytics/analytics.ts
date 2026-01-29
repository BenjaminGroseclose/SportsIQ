import { Component, inject } from '@angular/core';
import { PlayerStateService } from '@sports-iq/app/state';

@Component({
  selector: 'siq-analytics',
  imports: [],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics {
  private readonly playerStateService = inject(PlayerStateService);
}

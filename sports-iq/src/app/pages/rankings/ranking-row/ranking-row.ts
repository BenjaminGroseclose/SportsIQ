import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { IPlayerRanking } from '@sports-iq/app/models';
import { PositionChip } from '@sports-iq/app/components/position-chip/position-chip';
import { TeamLogo } from '@sports-iq/app/components/team-logo/team-logo';

@Component({
  selector: 'siq-ranking-row',
  imports: [CommonModule, PositionChip, TeamLogo],
  templateUrl: './ranking-row.html',
  styleUrl: './ranking-row.scss',
})
export class RankingRow {
  playerRanking = input.required<IPlayerRanking>();

  player = computed(() => this.playerRanking().player);
}

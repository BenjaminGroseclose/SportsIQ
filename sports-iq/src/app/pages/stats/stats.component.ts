import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { StatsService } from '../../sevices/stats.service';
import { NBAPlayer } from '../../models/nba-player.model';

@Component({
  selector: 'si-stats',
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
  providers: [StatsService],
})
export class StatsComponent {
  @Input() sport = '';

  constructor(private statsService: StatsService) {}
}

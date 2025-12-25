import { Component, computed, input } from '@angular/core';
import { ITeam } from '@sports-iq/app/models';

@Component({
  selector: 'siq-team-logo',
  imports: [],
  templateUrl: './team-logo.html',
  styleUrl: './team-logo.scss',
})
export class TeamLogo {
  team = input<ITeam | null>(null);
  size = input<'small' | 'medium' | 'large'>('medium');

  showUnknown = computed(() => !this.team() || !this.team()?.logo);
}

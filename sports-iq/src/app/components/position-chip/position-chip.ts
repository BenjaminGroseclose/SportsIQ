import { Component, computed, input } from '@angular/core';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'siq-position-chip',
  imports: [MatChip],
  templateUrl: './position-chip.html',
  styleUrl: './position-chip.scss',
})
export class PositionChip {
  position = input.required<string>();

  color = computed<string>(() => {
    switch (this.position().toLowerCase()) {
      case 'qb':
        return 'primary';
      case 'rb':
        return 'accent';
      case 'wr':
        return 'info';
      default:
        return '';
    }
  });
}

import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'siq-nav-item',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './nav-item.html',
  styleUrl: './nav-item.scss',
})
export class NavItem {
  icon = input<string>();
  title = input<string>();
  showTitle = input<boolean>();
  width = input<number>(60);

  clicked = output<void>();

  showIcon = computed(() => !!this.icon());
}

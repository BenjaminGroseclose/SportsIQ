import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'siq-dialog',
  imports: [CommonModule, MatDialogModule, MatIconModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {

  title = input.required<string>();
  icon = input<string>();
  type = input<'info' | 'warning' | 'error' | 'success'>('info');
}

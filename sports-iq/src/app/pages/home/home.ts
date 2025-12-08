import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'siq-home',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatChipsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}

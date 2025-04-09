import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RiotService } from './services/riot.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [RiotService],
})
export class AppComponent {}

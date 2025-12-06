import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidenav } from './components/sidenav/sidenav';
import { AuthenticationService } from '@sports-iq/libs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidenav],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly authenticationService = inject(AuthenticationService);

  ngOnInit(): void {
    this.authenticationService.initialize();
  }
}

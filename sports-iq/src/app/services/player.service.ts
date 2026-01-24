import { Injectable } from '@angular/core';
import { IPlayer } from '../models';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { HttpBase } from '@sports-iq/libs/services/http-base.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService extends HttpBase {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'player');
  }

  getPlayersBySport(sportId: number, includeRatings: boolean = false): Observable<IPlayer[]> {
    let url = `sport/${sportId}`;

    if (includeRatings) {
      url += '?includeRatings=true';
    }
    return this.get<IPlayer[]>(url);
  }

  getPlayersByTeam(teamId: number, includeRatings: boolean = false): Observable<IPlayer[]> {
    let url = `team/${teamId}`;

    if (includeRatings) {
      url += '?includeRatings=true';
    }
    return this.get<IPlayer[]>(url);
  }
}

import { HttpClient, httpResource } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { HttpBase } from '@sports-iq/libs/services/http-base.service';
import { Observable } from 'rxjs';
import { IPlayerRanking } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PlayerRankingService extends HttpBase {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'playerRanking');
  }

  getRankings(sportsID: number): Observable<IPlayerRanking[]> {
    return this.get<IPlayerRanking[]>(`${sportsID}`);
  }
}

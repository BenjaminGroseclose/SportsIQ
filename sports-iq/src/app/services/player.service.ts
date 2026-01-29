import { Injectable } from '@angular/core';
import { IPagedResponse, IPlayer } from '../models';
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

  getPlayers(filter: {
    sportId?: number;
    teamId?: number;
    seasonId?: number;
    includeRatings?: boolean;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDescending?: boolean;
  }): Observable<IPagedResponse<IPlayer>> {
    const qs = new URLSearchParams();
    if (filter.sportId != null) qs.set('sportId', String(filter.sportId));
    if (filter.teamId != null) qs.set('teamId', String(filter.teamId));
    if (filter.seasonId != null) qs.set('seasonId', String(filter.seasonId));
    if (filter.includeRatings) qs.set('includeRatings', 'true');
    if (filter.pageSize != null) qs.set('pageSize', String(filter.pageSize));
    if (filter.page != null) qs.set('page', String(filter.page));
    if (filter.sortBy) qs.set('sortBy', filter.sortBy);
    if (filter.sortDescending) qs.set('sortDescending', 'true');
    const query = qs.toString();
    return this.get<IPagedResponse<IPlayer>>(query ? `?${query}` : '');
  }
}

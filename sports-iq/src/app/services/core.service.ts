import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpBase } from '@sports-iq/libs/services/http-base.service';
import { Observable } from 'rxjs';
import { ISeason, ISport } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CoreService extends HttpBase {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'core');
  }

  getSports(): Observable<ISport[]> {
    return this.get<ISport[]>('sports');
  }

  getAllSeasons(): Observable<ISeason[]> {
    return this.get<ISeason[]>('seasons/all');
  }

  getSeasons(sportId: number): Observable<ISeason[]> {
    return this.get<ISeason[]>(`seasons/${sportId}`);
  }

  getTeams(sportId: number): Observable<any> {
    return this.get<any>(`teams/${sportId}`);
  }
}

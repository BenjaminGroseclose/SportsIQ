import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AppSettingsService } from './app-settings.service';

export class HttpBase {
  private appSettingsService = inject(AppSettingsService);

  protected baseUrl: string;

  constructor(protected http: HttpClient, private controller: string) {
    this.baseUrl = `${
      this.appSettingsService.getSettings().baseUrl
    }api/${controller}`;
  }

  get<T>(url: string | null): Observable<T> {
		let fullUrl = url == null ? this.baseUrl : `${this.baseUrl}/${url}`;

    return this.http
      .get<T>(fullUrl)
      .pipe(map((response: T) => response));
  }

  post<T>(url: string | null, body: any | null): Observable<T> {
		let fullUrl = url == null ? this.baseUrl : `${this.baseUrl}/${url}`;

    return this.http
      .post<T>(fullUrl, body)
      .pipe(map((response: T) => response));
  }

  put<T>(url: string | null, body: any | null): Observable<T> {
		let fullUrl = url == null ? this.baseUrl : `${this.baseUrl}/${url}`;

    return this.http
      .put<T>(fullUrl, body)
      .pipe(map((response: T) => response));
  }

  delete<T>(url: string | null): Observable<T> {
		let fullUrl = url == null ? this.baseUrl : `${this.baseUrl}/${url}`;

    return this.http
      .delete<T>(`${this.baseUrl}/${url}`)
      .pipe(map((response: T) => response));
  }
}

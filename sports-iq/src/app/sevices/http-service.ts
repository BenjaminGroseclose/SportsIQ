import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export abstract class HttpService {
  private readonly apiKey: string;

  constructor(protected http: HttpClient) {
    this.apiKey = environment.apiKey;
  }

  get<T>(
    url: string,
    options: {
      headers?: HttpHeaders;
    }
  ): Observable<T> {
    options.headers?.set('X-API-KEY', this.apiKey);

    return this.http
      .get<T>(url, { ...options })
      .pipe(map((response: T) => response));
  }

  post<T>(
    url: string,
    body: any | null,
    options: {
      headers?: HttpHeaders;
    }
  ): Observable<T> {
    options.headers?.set('X-API-KEY', this.apiKey);

    return this.http
      .post<T>(url, body, { ...options })
      .pipe(map((response: T) => response));
  }

  put<T>(
    url: string,
    body: any | null,
    options: {
      headers?: HttpHeaders;
    }
  ): Observable<T> {
    options.headers?.set('X-API-KEY', this.apiKey);

    return this.http
      .put<T>(url, body, { ...options })
      .pipe(map((response: T) => response));
  }

  delete<T>(
    url: string,
    options: {
      headers?: HttpHeaders;
    }
  ): Observable<T> {
    options.headers?.set('X-API-KEY', this.apiKey);

    return this.http
      .delete<T>(url, { ...options })
      .pipe(map((response: T) => response));
  }
}

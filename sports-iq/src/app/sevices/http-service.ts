import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export abstract class HttpService {
  private readonly sharedHeader: HttpHeaders;
  private readonly baseUrl: string;

  constructor(protected http: HttpClient, controller: string) {
    this.baseUrl = `${environment.baseUrl}/${controller}`;
    this.sharedHeader = new HttpHeaders().set('X-API-KEY', environment.apiKey);
  }

  get<T>(url: string): Observable<T> {
    const options = {
      headers: new HttpHeaders(),
    };

    return this.http
      .get<T>(`${this.baseUrl}/${url}`, { headers: this.sharedHeader })
      .pipe(map((response: T) => response));
  }

  post<T>(url: string, body: any | null): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}/${url}`, body, { headers: this.sharedHeader })
      .pipe(map((response: T) => response));
  }

  put<T>(url: string, body: any | null): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}/${url}`, body, { headers: this.sharedHeader })
      .pipe(map((response: T) => response));
  }

  delete<T>(url: string): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}/${url}`, { headers: this.sharedHeader })
      .pipe(map((response: T) => response));
  }
}

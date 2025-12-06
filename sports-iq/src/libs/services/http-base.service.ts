import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@sports-iq/environments/environment';

export class HttpBase {
  protected baseUrl: string;

  constructor(
    protected http: HttpClient,
    private controller: string,
  ) {
    this.baseUrl = `${environment.baseUrl}api/${controller}`;
  }

  get<T>(url: string | null): Observable<T> {
    let fullUrl = url == null ? this.baseUrl : `${this.baseUrl}/${url}`;

    return this.http.get<T>(fullUrl).pipe(map((response: T) => response));
  }

  post<T>(url: string | null, body: any | null): Observable<T> {
    let fullUrl = url == null ? this.baseUrl : `${this.baseUrl}/${url}`;

    return this.http.post<T>(fullUrl, body).pipe(map((response: T) => response));
  }

  put<T>(url: string | null, body: any | null): Observable<T> {
    let fullUrl = url == null ? this.baseUrl : `${this.baseUrl}/${url}`;

    return this.http.put<T>(fullUrl, body).pipe(map((response: T) => response));
  }

  delete<T>(url: string | null): Observable<T> {
    let fullUrl = url == null ? this.baseUrl : `${this.baseUrl}/${url}`;

    return this.http.delete<T>(`${this.baseUrl}/${url}`).pipe(map((response: T) => response));
  }
}

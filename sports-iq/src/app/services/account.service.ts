import { Injectable } from '@angular/core';
import { HttpBase } from '../../libs/services/http-base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAccount } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AccountService extends HttpBase {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'account');
  }

  getUser(): Observable<IAccount> {
    return this.get<IAccount>();
  }

  createAccount(account: IAccount): Observable<IAccount> {
    return this.post<IAccount>(null, account);
  }
}

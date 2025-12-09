import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpBase } from "@sports-iq/libs/services/http-base.service";
import { Observable } from "rxjs";
import { IFilter } from "../state/filter-state.service";



@Injectable({
    providedIn: 'root',
})
export class CoreService extends HttpBase {
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'core');
    }

    getFilters(): Observable<IFilter    []> {
        return this.get<IFilter[]>("filters");
    }
}
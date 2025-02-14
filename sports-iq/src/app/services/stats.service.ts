import { Injectable } from "@angular/core";
import { HttpService } from "./http-service";
import { HttpClient } from "@angular/common/http";
import { Observable, take } from "rxjs";
import { MLBHitter } from "@sports-iq/models";

@Injectable()
export class StatsService extends HttpService {
	constructor(protected httpBase: HttpClient) {
		super(httpBase, "stats");
	}

	getHitters(year: number[]): Observable<MLBHitter[]> {
		return this.get<MLBHitter[]>(`mlb/hitters/${year}`).pipe(take(1));
	}

	getPlayers<T>(sport: string, year: number[]): Observable<T[]> {
		return this.get<T[]>(`${sport}/players/${year}`).pipe(take(1));
	}

	getTeams<T>(sport: string, year: number[]): Observable<T[]> {
		return this.get<T[]>(`${sport}/teams/${year}`).pipe(take(1));
	}

	getYears(sport: string): Observable<number[]> {
		return this.get<number[]>(`${sport}/years`).pipe(take(1));
	}

	getPositions(sport: string): Observable<string[]> {
		return this.get<string[]>(`${sport}/positions`).pipe(take(1));
	}
}

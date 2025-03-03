import { Injectable } from "@angular/core";
import { HttpService } from "./http-service";
import { HttpClient } from "@angular/common/http";
import { Observable, take } from "rxjs";
import { MLBBatter } from "@sports-iq/models";
import { MLBPitcher } from "@sports-iq/models/mlb-pitcher.model";

@Injectable()
export class StatsService extends HttpService {
	constructor(protected httpBase: HttpClient) {
		super(httpBase, "stats");
	}

	getHitters(year: number[]): Observable<MLBBatter[]> {
		return this.get<MLBBatter[]>(`mlb/hitters/${year}`).pipe(take(1));
	}

	getPitchers(year: number[]): Observable<MLBPitcher[]> {
		return this.get<MLBPitcher[]>(`mlb/pitchers/${year}`).pipe(take(1));
	}

	getPlayers<T>(sport: string, year: number[]): Observable<T[]> {
		return this.get<T[]>(`${sport}/players/${year}`).pipe(take(1));
	}

	getTeamStats<T>(sport: string, year: number[]): Observable<T[]> {
		return this.get<T[]>(`${sport}/teamStats/${year}`).pipe(take(1));
	}

	getSeasons(sport: string): Observable<number[]> {
		return this.get<number[]>(`${sport}/seasons`).pipe(take(1));
	}

	getPositions(sport: string): Observable<string[]> {
		return this.get<string[]>(`${sport}/positions`).pipe(take(1));
	}
}

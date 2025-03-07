import { Injectable } from "@angular/core";
import { HttpService } from "./http-service";
import { HttpClient } from "@angular/common/http";
import { Observable, take } from "rxjs";
import { PlayerRanking } from "@sports-iq/models";

@Injectable()
export class RankingService extends HttpService {
	constructor(protected httpBase: HttpClient) {
		super(httpBase, "ranking");
	}

	getRanking(sport: string): Observable<PlayerRanking[]> {
		return this.get<PlayerRanking[]>(sport).pipe(take(1));
	}

	saveMatchupResult(sport: string, playerOne: PlayerRanking, playerTwo: PlayerRanking, winner: number): Observable<void> {
		return this.post<void>(sport, { playerOne, playerTwo, winner }).pipe(take(1));
	}
}

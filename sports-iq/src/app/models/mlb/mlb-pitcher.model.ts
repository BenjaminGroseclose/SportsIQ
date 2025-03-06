import { MLBPlayer } from "./mlb-player.model";

export interface MLBPitcher {
	player: MLBPlayer;
	teamID?: number;
	team: string;
	pitchingID: number;
	season: number;
	seasonType: number;
	games: number;
	starts: number;
	wins: number;
	losses: number;
	saves: number;
	inningsPitched: number;
	era: number;
	earnedRuns: number;
	hits: number;
	homeRuns: number;
	strikeouts: number;
	strikeoutsPerNineInnings: number;
	walks: number;
	walksPerNineInnings: number;
	whip: number;
	battingAverage: number;
	obp: number;
	shutouts: number;
	winLossPercentage: number;
}

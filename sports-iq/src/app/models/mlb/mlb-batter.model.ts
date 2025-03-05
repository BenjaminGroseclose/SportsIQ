export interface MLBBatter {
	playerID: number;
	name: string;
	teamID?: number;
	team: string;
	positionCategory: string;
	position: string;
	battingID: number;
	season: number;
	seasonType: number;
	games: number;
	atBats: number;
	runs: number;
	hits: number;
	doubles: number;
	triples: number;
	homeRuns: number;
	rbi: number;
	battingAverage: number;
	strikeouts: number;
	walks: number;
	hitsByPitch: number;
	steals: number;
	caughtStealing: number;
	obp: number;
	slug: number;
	obpPlus: number;
}

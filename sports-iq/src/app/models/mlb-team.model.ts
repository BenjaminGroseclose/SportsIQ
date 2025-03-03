export interface MLBTeamStats {
	teamStatsID: number;
	teamID: number;
	name: string;
	season: number;
	seasonType: number;
	wins: number;
	losses: number;
	atBats: number;
	runs: number;
	hits: number;
	doubles: number;
	triples: number;
	homeRuns: number;
	battingAverage: number;
	battingStrikeouts: number;
	steals: number;
	obp: number;
	slug: number;
	obpPlus: number;
	pitchingStrikeouts: number;
	saves: number;
	era: number;
	runsScoredByOpponent: number;
	pitchingHits: number;
	pitchingHomeRuns: number;
}

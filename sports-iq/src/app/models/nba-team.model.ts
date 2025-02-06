export interface NBATeam {
	id?: any | null;
	team?: string | null;
	wins?: number | null;
	loses?: number | null;
	expectedWins?: number | null;
	expectedLoses?: number | null;
	marginOfVictory?: number | null;
	strengthOfSchedule?: number | null;
	simpleRatingSystem?: number | null;
	offensiveRating?: number | null;
	defensiveRating?: number | null;
	netRating?: number | null;
	pace?: number | null;
	freeThrowRate?: number | null;
	threePointRate?: number | null;
	trueShootingPercent?: number | null;
	efieldGoalPercent?: number | null;
	turnoverPercent?: number | null;
	offensiveReboundPercent?: number | null;
	freeThrowPerFieldGoal?: number | null;
	defensiveEFieldGoalPercent?: number | null;
	defensiveTurnoverPercent?: number | null;
	defensiveReboundPercent?: number | null;
	defensiveFreeThrowPerFieldGoal?: number | null;
	year: number;
}

package com.sportsiq.models

data class MLBPitcher(
    val playerID: Int,
    val name: String,
    val teamID: Int?,
    val team: String,
    val pitchingID: Int,
    val positionCategory: String,
    val position: String,
    val season: Int,
    val seasonType: Int,
    val games: Int,
    val starts: Int,
    val wins: Int,
    val losses: Int,
    val saves: Int,
    val inningsPitched: Double,
    val era: Double,
    val earnedRuns: Int,
    val hits: Int,
    val homeRuns: Int,
    val strikeouts: Int,
    val strikeoutsPerNineInnings: Double,
    val walks: Int,
    val walksPerNineInnings: Double,
    val whip: Double,
    val battingAverage: Double,
    val obp: Double,
    val shutouts: Int
) {
    val winLossPercentage: Double
        get() = if (losses == 0) 1.0 else (wins * 1.0 / (wins + losses))
}
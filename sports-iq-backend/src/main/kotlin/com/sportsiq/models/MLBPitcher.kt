package com.sportsiq.models

data class MLBPitcher(
    var playerID: Int,
    var name: String,
    var teamID: Int?,
    var team: String,
    var pitchingID: Int,
    var positionCategory: String,
    var position: String,
    var season: Int,
    var seasonType: Int,
    var games: Int,
    var starts: Int,
    var wins: Int,
    var losses: Int,
    var saves: Int,
    var inningsPitched: Double,
    var era: Double,
    var earnedRuns: Int,
    var hits: Int,
    var homeRuns: Int,
    var strikeouts: Int,
    var strikeoutsPerNineInnings: Double,
    var walks: Int,
    var walksPerNineInnings: Double,
    var whip: Double,
    var battingAverage: Double,
    var obp: Double,
    var shutouts: Int
) {
    val winLossPercentage: Double
        get() = if (losses == 0) 1.0 else (wins * 1.0 / (wins + losses))
}
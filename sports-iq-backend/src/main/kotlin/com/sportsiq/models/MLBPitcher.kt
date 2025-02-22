package com.sportsiq.models

import java.util.Date

data class MLBPitcher(
    var playerID: Int,
    var name: String,
    var dateOfBirth: Date,
    var teamID: Int?,
    var team: String,
    var league: String,
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
    var runs: Int,
    var hits: Int,
    var homeRuns: Int,
    var strikeouts: Int,
    var strikeoutsPerNineInnings: Double,
    var walks: Int,
    var walksPerNineInnings: Double,
    var pitchesThrown: Int,
    var whip: Double,
    var battingAverage: Double,
    var obp: Double,
    var slug: Double,
    var obpPlus: Double,
    var shutouts: Int
) {
}
package com.sportsiq.models

data class MLBBatter(
    var playerID: Int,
    var name: String,
    var teamID: Int,
    var team: String,
    var position: String,
    var positionCategory: String,
    var battingID: Int,
    var season: Int,
    var seasonType: Int,
    var games: Int,
    var atBats: Int,
    var runs: Int,
    var hits: Int,
    var doubles: Int,
    var triples: Int,
    var homeRuns: Int,
    var rbi: Int,
    var battingAverage: Double,
    var strikeouts: Int,
    var walks: Int,
    var hitsByPitch: Int,
    var steals: Int,
    var caughtStealing: Int,
    var obp: Double,
    var slug: Double,
    var obpPlus: Double
) {

}
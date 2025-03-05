package com.sportsiq.models

data class MLBBatter(
    val playerID: Int,
    val name: String,
    val teamID: Int?,
    val team: String,
    val positionCategory: String,
    val position: String,
    val battingID: Int,
    val season: Int,
    val seasonType: Int,
    val games: Int,
    val atBats: Int,
    val runs: Int,
    val hits: Int,
    val doubles: Int,
    val triples: Int,
    val homeRuns: Int,
    val rbi: Int,
    val battingAverage: Double,
    val strikeouts: Int,
    val walks: Int,
    val hitsByPitch: Int,
    val steals: Int,
    val caughtStealing: Int,
    val obp: Double,
    val slug: Double,
    val obpPlus: Double
) {

}
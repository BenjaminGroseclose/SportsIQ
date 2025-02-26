package com.sportsiq.models

data class MLBTeamStats(
    val teamStatsID: Int,
    val teamID: Int,
    val name: String,
    val season: Int,
    val seasonType: Int,
    val wins: Int,
    val losses: Int,
    val atBats: Int,
    val runs: Int,
    val hits: Int,
    val doubles: Int,
    val triples: Int,
    val homeRuns: Int,
    val battingAverage: Double,
    val battingStrikeouts: Int,
    val steals: Int,
    val obp: Double,
    val slug: Double,
    val obpPlus: Double,
    val pitchingStrikeouts: Int,
    val saves: Int,
    val era: Double,
    val runsScoredByOpponent: Int,
    val pitchingHits: Int,
    val pitchingHomeRuns: Int
) {

}
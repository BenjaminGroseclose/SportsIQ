package com.sportsiq.models

import org.springframework.jdbc.core.RowMapper

data class MLBBatter(
    val player: MLBPlayer,
    val teamID: Int?,
    val team: String,
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
    companion object {
        val ROW_MAPPER = RowMapper<MLBBatter> { rs, _ ->
            MLBBatter(
                player = MLBPlayer(
                    playerID = rs.getInt("PlayerID"),
                    name = rs.getString("Name"),
                    positionCategory = rs.getString("PositionCategory"),
                    position = rs.getString("Position"),
                    batHand = rs.getString("BatHand"),
                    throwHand = rs.getString("ThrowHand"),
                    dateOfBirth = rs.getDate("DateOfBirth")
                ),
                teamID = rs.getInt("TeamID"),
                team = rs.getString("Team"),
                battingID = rs.getInt("BattingID"),
                season = rs.getInt("Season"),
                seasonType = rs.getInt("SeasonType"),
                games = rs.getInt("Games"),
                atBats = rs.getInt("AtBats"),
                runs = rs.getInt("Runs"),
                hits = rs.getInt("Hits"),
                doubles = rs.getInt("Doubles"),
                triples = rs.getInt("Triples"),
                homeRuns = rs.getInt("HomeRuns"),
                rbi = rs.getInt("RunsBattedIn"),
                battingAverage = rs.getDouble("BattingAverage"),
                strikeouts = rs.getInt("strikeouts"),
                walks = rs.getInt("Walks"),
                hitsByPitch = rs.getInt("HitByPitch"),
                steals = rs.getInt("Steals"),
                caughtStealing = rs.getInt("CaughtStealing"),
                obp = rs.getDouble("OBP"),
                slug = rs.getDouble("Slug"),
                obpPlus = rs.getDouble("OBPPlus")
            )
        }
    }
}
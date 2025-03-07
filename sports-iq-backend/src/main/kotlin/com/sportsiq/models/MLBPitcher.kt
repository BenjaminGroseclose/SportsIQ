package com.sportsiq.models

import org.springframework.jdbc.core.RowMapper

data class MLBPitcher(
    val player: MLBPlayer,
    val teamID: Int?,
    val team: String,
    val pitchingID: Int,
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

    companion object {
        val ROW_MAPPER = RowMapper<MLBPitcher> { rs, _ ->
            MLBPitcher(
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
                pitchingID = rs.getInt("PitchingID"),
                season = rs.getInt("Season"),
                seasonType = rs.getInt("SeasonType") ,
                games = rs.getInt("Games"),
                starts = rs.getInt("Starts"),
                wins = rs.getInt("Wins"),
                losses = rs.getInt("Losses"),
                saves = rs.getInt("Saves"),
                inningsPitched =  rs.getDouble("InningsPitched"),
                era = rs.getDouble("ERA"),
                earnedRuns = rs.getInt("EarnedRuns"),
                hits = rs.getInt("Hits"),
                homeRuns = rs.getInt("HomeRuns"),
                strikeouts = rs.getInt("Strikeouts"),
                strikeoutsPerNineInnings = rs.getDouble("StrikeoutsPerNineInnings"),
                walks = rs.getInt("Walks"),
                walksPerNineInnings = rs.getDouble("WalksPerNineInnings"),
                whip = rs.getDouble("WHIP"),
                battingAverage = rs.getDouble("BattingAverageAgainst"),
                obp = rs.getDouble("OBP"),
                shutouts = rs.getInt("Shutouts")
            )
        }
    }
}
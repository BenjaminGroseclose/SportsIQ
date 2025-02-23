package com.sportsiq.data.queries

import com.sportsiq.data.IQuery
import com.sportsiq.models.MLBPitcher
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper

class GetMLBPitchers(private val years: Array<Int>) : IQuery<MLBPitcher> {

    override var sql: String = """
SELECT
    """.trimIndent()
    
    override val mapper: RowMapper<MLBPitcher> = RowMapper<MLBPitcher> { rs, rowNum ->
        MLBPitcher(
            playerID = rs.getInt("PlayerID"),
            name = rs.getString("Name"),
            teamID = rs.getInt("TeamID"),
            team = rs.getString("Team"),
            pitchingID = rs.getInt("PitchingID"),
            positionCategory = rs.getString("PositionCategory"),
            position = rs.getString("Position"),
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
            pitchesThrown = rs.getInt("PitchesThrown"),
            whip = rs.getDouble("WHIP"),
            battingAverage = rs.getDouble("BattingAverageAgainst"),
            obp = rs.getDouble("OBP"),
            shutouts = rs.getInt("Shutouts")

        )
    }

    override fun execute(template: JdbcTemplate): List<MLBPitcher> {
        return template.query(sql, mapper, years)
    }
}
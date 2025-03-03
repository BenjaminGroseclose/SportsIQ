package com.sportsiq.data.queries.mlb

import com.sportsiq.data.IQuery
import com.sportsiq.models.MLBTeamStats
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper

class GetMLBTeamStats(private val seasons: Array<Int>) : IQuery<MLBTeamStats> {
    override var sql: String = """
SELECT
    t.City + ' ' + t.Name AS [Name]
    ,ts.*
FROM
    MLB.TeamStats ts 
    JOIN MLB.Teams t ON t.TeamID = ts.TeamID
WHERE
    ts.SeasonType = 1 AND ts.Season IN (
    """.trimIndent()
    override val mapper: RowMapper<MLBTeamStats> = RowMapper<MLBTeamStats> { rs, _ -> MLBTeamStats(
        teamStatsID = rs.getInt("TeamStatID"),
        teamID = rs.getInt("TeamID"),
        name = rs.getString("Name"),
        season = rs.getInt("Season"),
        seasonType = rs.getInt("SeasonType"),
        wins = rs.getInt("wins"),
        losses = rs.getInt("losses"),
        atBats = rs.getInt("AtBats"),
        runs = rs.getInt("Runs"),
        hits = rs.getInt("Hits"),
        doubles = rs.getInt("Doubles"),
        triples = rs.getInt("Triples"),
        homeRuns = rs.getInt("homeRuns"),
        battingAverage = rs.getDouble("BattingAverage"),
        battingStrikeouts = rs.getInt("BattingStrikeouts"),
        steals = rs.getInt("Steals"),
        obp = rs.getDouble("OBP"),
        slug = rs.getDouble("Slug"),
        obpPlus = rs.getDouble("OBPPlus"),
        pitchingStrikeouts =rs.getInt("PitchingStrikeouts"),
        saves = rs.getInt("Saves"),
        era = rs.getDouble("ERA"),
        runsScoredByOpponent = rs.getInt("RunsScoredByOpponent"),
        pitchingHits = rs.getInt("PitchingHits"),
        pitchingHomeRuns = rs.getInt("PitchingHomeRuns"),
    )
    }
    override fun execute(template: JdbcTemplate): List<MLBTeamStats> {
        val seasonString = seasons.joinToString(",")

        sql = "$sql$seasonString)"
        return template.query(sql, mapper)
    }
}
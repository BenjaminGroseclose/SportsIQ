package com.sportsiq.data.queries.mlb

import com.sportsiq.data.IQuery
import com.sportsiq.data.queries.BaseQuery
import com.sportsiq.models.MLBBatter
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper

class GetMLBBatters(private val seasons: Array<Int>) : IQuery<MLBBatter> {
    override var sql: String = """
${BaseQuery.MLB_BATTING}
WHERE
    SeasonType = 1 AND Season IN (
    """.trimIndent()
    override val mapper: RowMapper<MLBBatter> = RowMapper<MLBBatter> { rs, _ ->
        MLBBatter(
            playerID = rs.getInt("PlayerID"),
            name = rs.getString("Name"),
            teamID = rs.getInt("TeamID"),
            team = rs.getString("Team"),
            battingID = rs.getInt("BattingID"),
            positionCategory = rs.getString("PositionCategory"),
            position = rs.getString("Position"),
            season = rs.getInt("Season"),
            seasonType = rs.getInt("SeasonType") ,
            games = rs.getInt("Games"),
            atBats = rs.getInt("AtBats"),
            runs = rs.getInt("Runs"),
            hits = rs.getInt("Hits"),
            doubles = rs.getInt("Doubles"),
            triples =  rs.getInt("Triples"),
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
    override fun execute(template: JdbcTemplate): List<MLBBatter> {
        val seasonString = seasons.joinToString(",")

        sql = "$sql$seasonString)"
        return template.query(sql, mapper)
    }
}
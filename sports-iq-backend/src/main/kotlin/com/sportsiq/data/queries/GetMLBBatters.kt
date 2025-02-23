package com.sportsiq.data.queries

import com.sportsiq.data.IQuery
import com.sportsiq.models.MLBBatter
import com.sportsiq.models.MLBPitcher
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper

class GetMLBBatters(private val years: Array<Int>) : IQuery<MLBBatter> {

    override var sql: String = """
SELECT
    p.PlayerID
    ,p.FirstName + ' ' + p.LastName AS [Name]
    ,t.TeamID
    ,t.Abbreviation AS [Team]
    ,p.[Position]
    ,p.PositionCategory
    ,b.BattingID
    ,b.Season
    ,b.SeasonType
    ,b.Games
    ,b.AtBats
    ,b.Runs
    ,b.Hits
    ,b.Doubles
    ,b.Triples
    ,b.HomeRuns
    ,b.RunsBattedIn AS [RBI]
    ,b.BattingAverage
    ,b.Strikeouts
    ,b.Walks
    ,b.HitByPitch
    ,b.Steals
    ,b.CaughtStealing
    ,b.OBP
    ,b.Slug
    ,b.OBPPlus
FROM
    MLB.Batting b 
    JOIN MLB.Players p ON p.PlayerID = b.PlayerID
    JOIN MLB.Teams t ON t.TeamID = b.TeamID
    """.trimIndent()

    override val mapper: RowMapper<MLBBatter> = RowMapper<MLBBatter> { rs, rowNum ->
        MLBBatter(
            playerID = rs.getInt("PlayerID"),
            name = rs.getString("Name"),
            teamID = rs.getInt("TeamID"),
            team = rs.getString("Team"),
            position = rs.getString("Position"),
            positionCategory = rs.getString("PositionCategory"),
            battingID = rs.getInt("BattingID"),
            season = rs.getInt("Season"),
            seasonType = rs.getInt("SeasonType") ,
            games = rs.getInt("Games"),
            atBats = rs.getInt("AtBats"),
            runs = rs.getInt("Runs"),
            hits = rs.getInt("Hits"),
            doubles = rs.getInt("Doubles"),
            triples = rs.getInt("Triples"),
            homeRuns = rs.getInt("HomeRuns"),
            rbi = rs.getInt("RBI"),
            battingAverage = rs.getDouble("BattingAverage"),
            strikeouts = rs.getInt("Strikeouts"),
            walks = rs.getInt("Walks"),
            hitsByPitch = rs.getInt("HitByPitch"),
            steals = rs.getInt("Steals"),
            caughtStealing = rs.getInt("CaughtStealing"),
            obp = rs.getDouble("OBP"),
            slug = rs.getDouble("Slug"),
            obpPlus = rs.getDouble("OBPPlus"),
        )
    }

    override fun execute(template: JdbcTemplate): List<MLBBatter> {
        return template.query(sql, mapper, years)
    }
}
package com.sportsiq.data.queries.mlb

import com.sportsiq.data.IQuery
import com.sportsiq.models.PlayerRanking
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper

class GetMLBRanking: IQuery<PlayerRanking> {
    override var sql: String = """
SELECT
    ROW_NUMBER() OVER (ORDER BY r.Elo DESC) AS [Rank]
    ,r.RankingID
    ,r.PlayerID
    ,r.Elo
    ,p.FirstName + ' ' + p.LastName AS [Name]
    ,p.[Position]
    ,p.PositionCategory
    ,r.Season
    ,DATEDIFF(hour,p.DateOfBirth,GETDATE())/8766 AS Age
FROM
    MLB.Ranking r 
    JOIN MLB.Players p ON p.PlayerID = r.PlayerID
ORDER BY
    r.Elo DESC
    """.trimIndent()
    override val mapper: RowMapper<PlayerRanking> = RowMapper<PlayerRanking> { rs, _ ->
        PlayerRanking(
            rank = rs.getInt("Rank"),
            rankingID = rs.getInt("RankingID"),
            playerID = rs.getInt("PlayerID"),
            elo = rs.getInt("Elo"),
            name = rs.getString("Name"),
            position = rs.getString("Position"),
            season = rs.getInt("Season"),
            age = rs.getInt("Age")
        )
    }
    override fun execute(template: JdbcTemplate): List<PlayerRanking> {
        return template.query(sql, mapper)
    }
}
package com.sportsiq.data.commands.mlb

import com.sportsiq.data.ICommand
import org.springframework.jdbc.core.JdbcTemplate

class SaveMatchUpResults(val rankingID: Int, val elo: Int) : ICommand {
    override var sql: String = """
UPDATE MLB.Ranking
SET Elo = ?
WHERE RankingID = ?""".trimIndent()

    override fun execute(template: JdbcTemplate): Int {
        template.update(sql, elo, rankingID)

        return 1
    }
}
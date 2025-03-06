package com.sportsiq.data.queries.mlb

import com.sportsiq.data.IQuerySingle
import com.sportsiq.data.queries.BaseQuery
import com.sportsiq.models.MLBPitcher
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper

class GetMLBPitcherByID(private val playerID: Int) : IQuerySingle<MLBPitcher> {
    override var sql: String = """
${BaseQuery.MLB_BATTING}
WHERE
    SeasonType = 1 
    AND Season = 2024
    AND PlayerID = """.trimIndent()
    override val mapper: RowMapper<MLBPitcher> = MLBPitcher.ROW_MAPPER
    override fun execute(template: JdbcTemplate): MLBPitcher {

        sql = "$sql$playerID;"
        return template.query(sql, mapper).first()
    }
}
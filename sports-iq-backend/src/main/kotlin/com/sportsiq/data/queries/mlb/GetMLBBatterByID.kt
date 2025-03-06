package com.sportsiq.data.queries.mlb

import com.sportsiq.data.IQuerySingle
import com.sportsiq.data.queries.BaseQuery
import com.sportsiq.models.MLBBatter
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper

class GetMLBBatterByID(private val playerID: Int) : IQuerySingle<MLBBatter> {
    override var sql: String = """
${BaseQuery.MLB_BATTING}
WHERE
    SeasonType = 1 
    AND Season = 2024
    AND PlayerID = """.trimIndent()
    override val mapper: RowMapper<MLBBatter> = MLBBatter.ROW_MAPPER
    override fun execute(template: JdbcTemplate): MLBBatter {

        sql = "$sql$playerID;"
        return template.query(sql, mapper).first()
    }
}
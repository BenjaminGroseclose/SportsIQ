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
    SeasonType = 1 AND Season IN (""".trimIndent()
    override val mapper: RowMapper<MLBBatter> = MLBBatter.ROW_MAPPER
    override fun execute(template: JdbcTemplate): List<MLBBatter> {
        val seasonString = seasons.joinToString(",")

        sql = "$sql$seasonString);"
        return template.query(sql, mapper)
    }
}
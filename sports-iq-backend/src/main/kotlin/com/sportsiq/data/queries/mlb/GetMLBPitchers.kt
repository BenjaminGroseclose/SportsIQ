package com.sportsiq.data.queries.mlb

import com.sportsiq.data.IQuery
import com.sportsiq.data.queries.BaseQuery
import com.sportsiq.models.MLBPitcher
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper

class GetMLBPitchers(private val seasons: Array<Int>) : IQuery<MLBPitcher> {

    override var sql: String = """
${BaseQuery.MLB_PITCHING}
WHERE
    SeasonType = 1 AND Season IN (""".trimIndent()
    
    override val mapper: RowMapper<MLBPitcher> = MLBPitcher.ROW_MAPPER

    override fun execute(template: JdbcTemplate): List<MLBPitcher> {
        val seasonString = seasons.joinToString(",")

        sql = "$sql$seasonString);"
        return template.query(sql, mapper)
    }
}
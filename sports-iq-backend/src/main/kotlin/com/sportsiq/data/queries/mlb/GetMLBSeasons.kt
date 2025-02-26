package com.sportsiq.data.queries.mlb

import com.sportsiq.data.IQuery
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper

class GetMLBSeasons : IQuery<Int> {
    override var sql: String = "SELECT DISTINCT Season FROM MLB.Batting ORDER BY Season DESC"
    override val mapper: RowMapper<Int> = RowMapper<Int> { rs, _ -> rs.getInt(1)}
    override fun execute(template: JdbcTemplate): List<Int> {
        return template.query(sql, mapper)
    }
}
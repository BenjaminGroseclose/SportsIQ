package com.sportsiq.data.queries.mlb

import com.sportsiq.data.IQuery
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper

class GetMLBPositions : IQuery<String> {
    override var sql: String = "SELECT DISTINCT Position FROM MLB.Players"
    override val mapper: RowMapper<String> = RowMapper<String> { rs, _ -> rs.getString(1)}
    override fun execute(template: JdbcTemplate): List<String> {
        return template.query(sql, mapper)
    }
}
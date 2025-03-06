package com.sportsiq.data

import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper

interface IQuerySingle<T> {
    val sql: String
    val mapper: RowMapper<T>
    fun execute(template: JdbcTemplate): T
}
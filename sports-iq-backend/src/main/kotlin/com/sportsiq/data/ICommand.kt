package com.sportsiq.data

import org.springframework.jdbc.core.JdbcTemplate

interface ICommand {
    val sql: String
    fun execute(template: JdbcTemplate): Int
}
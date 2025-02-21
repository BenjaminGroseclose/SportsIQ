package com.sportsiq.repositories

import com.sportsiq.data.queries.GetMLBPitchers
import com.sportsiq.models.MLBPitcher
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate

class MLBRepository(@Autowired val jdbcTemplate: JdbcTemplate) {

    fun getPitchers(years: List<Int>): List<MLBPitcher> {
        return GetMLBPitchers(years).execute(jdbcTemplate)
    }
}
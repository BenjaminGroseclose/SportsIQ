package com.sportsiq.services

import com.sportsiq.data.queries.GetMLBBatters
import com.sportsiq.data.queries.GetMLBPitchers
import com.sportsiq.data.queries.GetMLBSeasons
import com.sportsiq.models.MLBBatter
import com.sportsiq.models.MLBPitcher
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class MLBService(@Autowired val jdbcTemplate: JdbcTemplate) {
    fun getBatters(years: Array<Int>): List<MLBBatter> {
        return GetMLBBatters(years).execute(jdbcTemplate)
    }

    fun getPitchers(years: Array<Int>): List<MLBPitcher> {
        return GetMLBPitchers(years).execute(jdbcTemplate)
    }

    fun getSeasons(): List<Int> {
        return GetMLBSeasons().execute(jdbcTemplate)
    }
}
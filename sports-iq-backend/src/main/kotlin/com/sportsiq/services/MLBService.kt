package com.sportsiq.services

import com.sportsiq.data.queries.GetMLBSeasons
import com.sportsiq.models.MLBHitter
import com.sportsiq.models.MLBPitcher
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class MLBService(@Autowired val jdbcTemplate: JdbcTemplate) {
//    fun getHitter(years: Array<Int>): List<MLBHitter> {
//        return when (years.size) {
//            0 -> mlbHitterRepository.findAll().sortedByDescending { it.plateAppearances }
//            else -> mlbHitterRepository.findAllByYearIn(years).sortedByDescending { it.plateAppearances }
//        }
//    }
//
//    fun getPitchers(years: Array<Int>): List<MLBPitcher> {
//        return when (years.size) {
//            0 -> mlbPitcherRepository.findAll().sortedByDescending { it.ip }
//            else -> mlbPitcherRepository.findAllByYearIn(years).sortedByDescending { it.ip }
//        }
//    }

    fun getSeasons(): List<Int> {
        return GetMLBSeasons().execute(jdbcTemplate)
    }
}
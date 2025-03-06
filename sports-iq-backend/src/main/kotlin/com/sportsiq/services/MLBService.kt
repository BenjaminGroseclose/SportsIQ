package com.sportsiq.services

import com.sportsiq.data.queries.mlb.*
import com.sportsiq.models.MLBBatter
import com.sportsiq.models.MLBPitcher
import com.sportsiq.models.PlayerRanking
import com.sportsiq.models.MLBTeamStats
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class MLBService(@Autowired val jdbcTemplate: JdbcTemplate) {
    fun getBatters(seasons: Array<Int>): List<MLBBatter> {
        return GetMLBBatters(seasons).execute(jdbcTemplate)
    }

    fun getBatter(playerID: Int): MLBBatter {
        return GetMLBBatterByID(playerID).execute(jdbcTemplate)
    }

    fun getPitchers(seasons: Array<Int>): List<MLBPitcher> {
        return GetMLBPitchers(seasons).execute(jdbcTemplate)
    }

    fun getPitcher(playerID: Int): MLBPitcher {
        return GetMLBPitcherByID(playerID).execute(jdbcTemplate)
    }

    fun getTeamStats(seasons: Array<Int>): List<MLBTeamStats> {
        return GetMLBTeamStats(seasons).execute(jdbcTemplate)
    }

    fun getRankings(): List<PlayerRanking> {
        return GetMLBRanking().execute(jdbcTemplate)
    }

    fun saveMatchup() {

    }

    fun getSeasons(): List<Int> {
        return GetMLBSeasons().execute(jdbcTemplate)
    }

    fun getPositions(): List<String> {
        return GetMLBPositions().execute(jdbcTemplate)
    }
}
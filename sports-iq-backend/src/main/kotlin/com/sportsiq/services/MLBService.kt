package com.sportsiq.services

import com.sportsiq.controllers.requests.MatchUpResultRequest
import com.sportsiq.data.commands.mlb.SaveMatchUpResults
import com.sportsiq.data.queries.mlb.*
import com.sportsiq.models.MLBBatter
import com.sportsiq.models.MLBPitcher
import com.sportsiq.models.PlayerRanking
import com.sportsiq.models.MLBTeamStats
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service
import kotlin.math.abs
import kotlin.math.pow

@Service
class MLBService(@Autowired val jdbcTemplate: JdbcTemplate) {
    fun getBatters(seasons: Array<Int>): List<MLBBatter> {
        return GetMLBBatters(seasons).execute(jdbcTemplate)
    }

    fun getPitchers(seasons: Array<Int>): List<MLBPitcher> {
        return GetMLBPitchers(seasons).execute(jdbcTemplate)
    }

    fun getTeamStats(seasons: Array<Int>): List<MLBTeamStats> {
        return GetMLBTeamStats(seasons).execute(jdbcTemplate)
    }

    fun getRankings(): List<PlayerRanking> {
        return GetMLBRanking().execute(jdbcTemplate)
    }

    fun saveMatchUp(request: MatchUpResultRequest) {
        val baseElo = 8
        val ratingDifference = abs(request.playerOne.elo - request.playerTwo.elo)
        val expectedScore = 1 / (1 + 10.0.pow(ratingDifference / 400))

        if (request.winner == 0) {
            val playerOneElo = request.playerOne.elo + (baseElo * (1 - expectedScore)).toInt()
            val playerTwoElo = request.playerTwo.elo + (baseElo * (0 - expectedScore)).toInt()

            SaveMatchUpResults(request.playerOne.rankingID, playerOneElo).execute(jdbcTemplate)
            SaveMatchUpResults(request.playerTwo.rankingID, playerTwoElo).execute(jdbcTemplate)
        } else {
            val playerOneElo = request.playerOne.elo + (baseElo * (0 - expectedScore)).toInt()
            val playerTwoElo = request.playerTwo.elo + (baseElo * (1 - expectedScore)).toInt()

            SaveMatchUpResults(request.playerOne.rankingID, playerOneElo).execute(jdbcTemplate)
            SaveMatchUpResults(request.playerTwo.rankingID, playerTwoElo).execute(jdbcTemplate)
        }
    }

    fun getSeasons(): List<Int> {
        return GetMLBSeasons().execute(jdbcTemplate)
    }

    fun getPositions(): List<String> {
        return GetMLBPositions().execute(jdbcTemplate)
    }
}
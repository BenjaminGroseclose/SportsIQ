package com.sportsiq.services

import com.sportsiq.models.NBAPlayer
import com.sportsiq.models.NBATeam
import com.sportsiq.repositories.NBAPlayerRepository
import com.sportsiq.repositories.NBATeamRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class NBAService(@Autowired private val nbaPlayerRepository: NBAPlayerRepository, @Autowired private val nbaTeamRepository: NBATeamRepository) {
    fun getPlayers(years: Array<Int>): List<NBAPlayer> {
        return when (years.size) {
            0 -> nbaPlayerRepository.findAll().sortedByDescending { it.pointsPerGame }
            else -> nbaPlayerRepository.findAllByYearIn(years).sortedByDescending { it.pointsPerGame }
        }
    }

    fun getTeams(years: Array<Int>): List<NBATeam> {
        return when (years.size) {
            0 -> nbaTeamRepository.findAll().sortedByDescending { it.netRating }
            else -> nbaTeamRepository.findAllByYearIn(years).sortedByDescending { it.netRating }
        }
    }
}

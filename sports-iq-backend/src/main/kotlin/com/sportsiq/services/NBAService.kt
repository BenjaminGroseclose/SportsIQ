package com.sportsiq.services

import com.sportsiq.models.NBAPlayer
import com.sportsiq.repositories.NBAPlayerRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class NBAService(@Autowired private val nbaPlayerRepository: NBAPlayerRepository) {
    fun getPlayers(year: Number): List<NBAPlayer> {
        return when (year) {
            -1 -> nbaPlayerRepository.findAll().sortedByDescending { it.pointsPerGame }
            else -> nbaPlayerRepository.findAllByYear(year).sortedByDescending { it.pointsPerGame }.take(10)
        }
    }
}

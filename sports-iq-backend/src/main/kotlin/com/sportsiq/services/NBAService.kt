package com.sportsiq.services

import com.sportsiq.models.NBAPlayer
import com.sportsiq.repositories.NBAPlayerRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class NBAService(@Autowired private val nbaPlayerRepository: NBAPlayerRepository) {
    fun getPlayers(): List<NBAPlayer> {
        return nbaPlayerRepository.findAll()
    }

}

package com.sportsiq.Services

import com.sportsiq.Models.NBAPlayer
import com.sportsiq.Repositories.NBAPlayerRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class NBAService(@Autowired private val nbaPlayerRepository: NBAPlayerRepository) {
    fun getPlayers(): List<NBAPlayer> {
        return nbaPlayerRepository.findAll()
    }

}

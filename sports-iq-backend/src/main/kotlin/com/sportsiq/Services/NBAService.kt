package com.sportsiq.Services

import com.sportsiq.Models.NBAPlayer
import com.sportsiq.Repositories.NBARepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class NBAService(@Autowired private val nbaRepository: NBARepository) {
    fun getPlayers(): List<NBAPlayer> {
        return nbaRepository.findAll()
    }

}

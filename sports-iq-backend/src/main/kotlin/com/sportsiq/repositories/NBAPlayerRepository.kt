package com.sportsiq.repositories

import com.sportsiq.models.NBAPlayer
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface NBAPlayerRepository: MongoRepository<NBAPlayer, String> {
    fun findAllByYear(year: Number): List<NBAPlayer>
}
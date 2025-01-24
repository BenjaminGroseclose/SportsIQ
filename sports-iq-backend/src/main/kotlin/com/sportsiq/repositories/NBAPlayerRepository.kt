package com.sportsiq.repositories

import com.sportsiq.models.NBAPlayer
import org.springframework.data.mongodb.repository.MongoRepository

interface NBAPlayerRepository: MongoRepository<NBAPlayer, String> { }
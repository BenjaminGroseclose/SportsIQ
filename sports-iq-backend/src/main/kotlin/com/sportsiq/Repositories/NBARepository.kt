package com.sportsiq.Repositories

import com.sportsiq.Models.NBAPlayer
import org.springframework.data.mongodb.repository.MongoRepository

interface NBARepository: MongoRepository<NBAPlayer, String> { }
package com.sportsiq.repositories

import com.sportsiq.models.MLBPitcher
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface MLBPitcherRepository: MongoRepository<MLBPitcher, String> {
    fun findAllByYearIn(years: Array<Int>): List<MLBPitcher>
}
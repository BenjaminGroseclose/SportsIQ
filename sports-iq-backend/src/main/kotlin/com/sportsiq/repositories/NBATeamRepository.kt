package com.sportsiq.repositories

import com.sportsiq.models.NBATeam
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface NBATeamRepository: MongoRepository<NBATeam, String> {
    fun findAllByYearIn(year: Array<Int>): List<NBATeam>
}
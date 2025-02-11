package com.sportsiq.services

import com.sportsiq.models.MLBHitter
import com.sportsiq.models.MLBPlayers
import com.sportsiq.repositories.MLBHitterRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class MLBService(@Autowired private val mlbHitterRepository: MLBHitterRepository) {
    fun getPlayers(years: Array<Int>): MLBPlayers {
        val hitters = when (years.size) {
            0 -> mlbHitterRepository.findAll().sortedByDescending { it.plateAppearances }
            else -> mlbHitterRepository.findAllByYearIn(years).sortedByDescending { it.plateAppearances }
        }


        return MLBPlayers(hitters)
    }
}
package com.sportsiq.services

import com.sportsiq.models.MLBHitter
import com.sportsiq.models.MLBPlayers
import com.sportsiq.repositories.MLBHitterRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.PathVariable

@Service
class MLBService(@Autowired private val mlbHitterRepository: MLBHitterRepository) {
    fun getHitter(years: Array<Int>): List<MLBHitter> {
        return when (years.size) {
            0 -> mlbHitterRepository.findAll().sortedByDescending { it.plateAppearances }
            else -> mlbHitterRepository.findAllByYearIn(years).sortedByDescending { it.plateAppearances }
        }
    }
}
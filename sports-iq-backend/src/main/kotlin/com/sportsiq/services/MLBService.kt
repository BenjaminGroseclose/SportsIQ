package com.sportsiq.services

import com.sportsiq.models.MLBHitter
import com.sportsiq.models.MLBPitcher
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.PathVariable

@Service
class MLBService() {
//    fun getHitter(years: Array<Int>): List<MLBHitter> {
//        return when (years.size) {
//            0 -> mlbHitterRepository.findAll().sortedByDescending { it.plateAppearances }
//            else -> mlbHitterRepository.findAllByYearIn(years).sortedByDescending { it.plateAppearances }
//        }
//    }
//
//    fun getPitchers(years: Array<Int>): List<MLBPitcher> {
//        return when (years.size) {
//            0 -> mlbPitcherRepository.findAll().sortedByDescending { it.ip }
//            else -> mlbPitcherRepository.findAllByYearIn(years).sortedByDescending { it.ip }
//        }
//    }
}
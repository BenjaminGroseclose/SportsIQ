package com.sportsiq.controllers

import com.sportsiq.models.MLBBatter
import com.sportsiq.models.MLBPitcher
import com.sportsiq.models.MLBTeamStats
import com.sportsiq.services.MLBService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("stats/mlb")
class MLBStatsController(@Autowired private val mlbService: MLBService) {

    @GetMapping("/hitters/{seasons}")
    fun getHitters(@PathVariable seasons: Array<Int>): List<MLBBatter> {
        return mlbService.getBatters(seasons)
    }

    @GetMapping("/pitchers/{seasons}")
    fun getPitchers(@PathVariable seasons: Array<Int>): List<MLBPitcher> {
        return mlbService.getPitchers(seasons)
    }

    @GetMapping("/teamStats/{seasons}")
    fun getTeamStats(@PathVariable seasons: Array<Int>): List<MLBTeamStats> {
        return mlbService.getTeamStats(seasons)
    }

    @GetMapping("seasons")
    fun getYears(): List<Int> {
        return mlbService.getSeasons()
    }

    @GetMapping("positions")
    fun getPositions(): List<String> {
        return mlbService.getPositions()
    }
}
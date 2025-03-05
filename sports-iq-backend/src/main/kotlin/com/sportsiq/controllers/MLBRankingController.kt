package com.sportsiq.controllers

import com.sportsiq.models.PlayerRanking
import com.sportsiq.services.MLBService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("ranking/mlb")
class MLBRankingController(@Autowired private val mlbService: MLBService) {

    @GetMapping
    fun getRankings(): List<PlayerRanking> {
        return mlbService.getRankings()
    }

    @PostMapping
    fun saveMatchupResult(): List<PlayerRanking> {
        mlbService.saveMatchup()

        return mlbService.getRankings()
    }
}
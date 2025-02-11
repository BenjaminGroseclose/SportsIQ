package com.sportsiq.controllers

import com.sportsiq.models.MLBPlayers
import com.sportsiq.services.MLBService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("stats/mlb")
class MLBController(@Autowired private val mlbService: MLBService) {

    @GetMapping("/players/{years}")
    fun getPlayer(@PathVariable years: Array<Int>): MLBPlayers {
        return mlbService.getPlayers(years)
    }
}
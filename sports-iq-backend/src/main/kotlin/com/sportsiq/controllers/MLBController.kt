package com.sportsiq.controllers

import com.sportsiq.models.MLBHitter
import com.sportsiq.models.MLBPitcher
import com.sportsiq.services.MLBService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("stats/mlb")
class MLBController(@Autowired private val mlbService: MLBService) {

    @GetMapping("/hitters/{years}")
    fun getHitters(@PathVariable years: Array<Int>): List<MLBHitter> {
        return mlbService.getHitter(years)
    }

    @GetMapping("/pitchers/{years}")
    fun getPitchers(@PathVariable years: Array<Int>): List<MLBPitcher> {
        return mlbService.getPitchers(years)
    }


    @GetMapping("years")
    fun getYears(): List<Int> {
        val retval = mutableListOf<Int>()

        for (i in 1991..2024) {
            retval.add(i)
        }

        return retval.sortedByDescending { it }
    }

    @GetMapping("positions")
    fun getPositions(): List<String> {
        return listOf("Hitters", "Pitchers")
    }
}
package com.sportsiq.controllers

import com.sportsiq.models.NBAPlayer
import com.sportsiq.services.NBAService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("stats/nba")
class NBAController(@Autowired private val nbaService: NBAService) {

    @GetMapping("/players/{year}")
    fun getPlayers(@PathVariable year: Int): List<NBAPlayer> {
        return nbaService.getPlayers(year);
    }

    @GetMapping("years")
    fun getYears(): List<Int> {
        val retval = mutableListOf<Int>()

        for (i in 1991..2025) {
            retval.add(i)
        }

        return retval.sortedByDescending { it }
    }
}
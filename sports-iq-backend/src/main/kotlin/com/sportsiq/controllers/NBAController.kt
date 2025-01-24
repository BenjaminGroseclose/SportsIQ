package com.sportsiq.controllers

import com.sportsiq.models.NBAPlayer
import com.sportsiq.services.NBAService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("nba")
class NBAController(@Autowired private val nbaService: NBAService) {

    @GetMapping("players")
    fun getPlayers(): List<NBAPlayer> {
        return nbaService.getPlayers();
    }
}
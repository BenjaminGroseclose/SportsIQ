package com.sportsiq.Controllers

import com.sportsiq.Models.NBAPlayer
import com.sportsiq.Services.NBAService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("nba")
class NBAController(@Autowired private val nbaService: NBAService) {

    @GetMapping
    fun getPlayers(): List<NBAPlayer> {
        return nbaService.getPlayers();
    }
}
package com.sportsiq.controllers.requests

import com.sportsiq.models.PlayerRanking

data class MatchUpResultRequest(
    val playerOne: PlayerRanking,
    val playerTwo: PlayerRanking,
    val winner: Int
) {
}
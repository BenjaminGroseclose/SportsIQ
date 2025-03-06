package com.sportsiq.models

data class PlayerRanking(
    val rank: Int,
    val positionRank: Int,
    val rankingID: Int,
    val playerID: Int,
    val elo: Int,
    val name: String,
    val position: String,
    val season: Int,
    val age: Int
) {

}

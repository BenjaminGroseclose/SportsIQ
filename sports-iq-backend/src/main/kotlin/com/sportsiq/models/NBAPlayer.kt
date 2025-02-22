package com.sportsiq.models

data class NBAPlayer(
    val player: String?,
    val position: String?,
    val age: Int?,
    val team: String?,
    val games: Int?,
    val gameStarts: Int?,
    val minutesPerGame: Double?,
    val fieldGoals: Double?,
    val fieldGoalAttempts: Double?,
    val fieldGoalPercent: Double?,
    val threePoints: Double?,
    val threePointAttempts: Double?,
    val threePointPercent: Double?,
    val twoPoints: Double?,
    val twoPointAttempts: Double?,
    val twoPointPercent: Double?,
    val eFieldGoalPercent: Double?,
    val freeThrows: Double,
    val freeThrowAttempts: Double,
    val offensiveRebounds: Double?,
    val defensiveRebounds: Double?,
    val totalRebounds: Double?,
    val assists: Double?,
    val steals: Double?,
    val blocks: Double?,
    val turnover: Double?,
    val personalFouls: Double?,
//    @Field("pointsPergame") val pointsPerGame: Double?,
    val year: Number?
) {
    val freeThrowPercent: Double
        get() = freeThrows  / freeThrowAttempts
}
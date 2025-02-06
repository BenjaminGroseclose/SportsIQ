package com.sportsiq.models

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field

@Document(collection = "nba-players")
data class NBAPlayer(
    @Id val id: ObjectId? = null,
    val player: String?,
    val position: String?,
    val age: Int?,
    val team: String?,
    val games: Int?,
    val gameStarts: Int?,
    val minutesPerGame: Double?,
    @Field("fieldGaols") val fieldGoals: Double?,
    val fieldGoalAttempts: Double?,
    val fieldGoalPercent: Double?,
    val threePoints: Double?,
    val threePointAttempts: Double?,
    val threePointPercent: Double?,
    val twoPoints: Double?,
    val twoPointAttempts: Double?,
    val twoPointPercent: Double?,
    val eFieldGoalPercent: Double?,
    val freeThrows: Double?,
    val freeThrowAttempts: Double?,
    val offensiveRebounds: Double?,
    val defensiveRebounds: Double?,
    val totalRebounds: Double?,
    val assists: Double?,
    val steals: Double?,
    val blocks: Double?,
    val turnover: Double?,
    val personalFouls: Double?,
    @Field("pointsPergame") val pointsPerGame: Double?,
    val year: Number?
) {
    val freeThrowPercent: Double
        get() = freeThrows ?: 1.0 / (freeThrowAttempts ?: 1.0)
}
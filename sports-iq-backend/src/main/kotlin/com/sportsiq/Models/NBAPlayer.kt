package com.sportsiq.Models

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document("nba-players")
data class NBAPlayer(
    @Id val id: ObjectId? = null,
    val player: String,
    val pos: String,
    val age: Int,
    val team: String,
    val games: Int,
    val gameStarts: Int,
    val minutesPerGame: Double,
    val fieldGoals: Double,
    val fieldGoalAttempts: Double,
    val fieldGoalPercent: Double,
    val threePoints: Double,
    val threePointAttempts: Double,
    val threePointPercent: Double,
    val twoPoints: Double,
    val twoPointAttempts: Double,
    val twoPointPercent: Double,
    val eFieldGoalPercent: Double,
    val freeThrow: Double,
    val freeThrowAttempts: Double,
    val offensiveRebounds: Double,
    val defensiveRebounds: Double,
    val totalRebounds: Double,
    val assists: Double,
    val steals: Double,
    val blocks: Double,
    val turnovers: Double,
    val personalFouls: Double,
    val pointsPerGame: Double,
    val year: String
) {
}
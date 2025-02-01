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
    val game: Int?,
    @Field("game-starts") val gameStarts: Int?,
    @Field("minutes-per-game") val minutesPerGame: Double?,
    @Field("field-goals") val fieldGoals: Double?,
    @Field("field-goal-attempts") val fieldGoalAttempts: Double?,
    @Field("field-point-percent") val fieldGoalPercent: Double?,
    @Field("three-points") val threePoints: Double?,
    @Field("three-point-attempts") val threePointAttempts: Double?,
    @Field("three-point-percent") val threePointPercent: Double?,
    @Field("two-points") val twoPoints: Double?,
    @Field("two-point-attempts") val twoPointAttempts: Double?,
    @Field("two-point-percent") val twoPointPercent: Double?,
    @Field("e-field-goal-percent") val eFieldGoalPercent: Double?,
    @Field("free-throws") val freeThrow: Double?,
    @Field("free-throw-attempts") val freeThrowAttempts: Double?,
    @Field("offensive-rebounds") val offensiveRebounds: Double?,
    @Field("defensive-rebounds") val defensiveRebounds: Double?,
    @Field("total-rebounds") val totalRebounds: Double?,
    val assists: Double?,
    val steals: Double?,
    val blocks: Double?,
    val turnover: Double?,
    @Field("personal-fouls") val personalFouls: Double?,
    @Field("points-per-game") val pointsPerGame: Double?,
    val year: Number?
) {
}
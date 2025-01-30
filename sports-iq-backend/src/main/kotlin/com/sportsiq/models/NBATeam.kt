package com.sportsiq.models

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field

@Document(collection = "nba-teams")
data class NBATeam (
    @Id val id: ObjectId? = null,
    val team: String?,
    @Field("FG%") val fieldGoalPercent: Double?,
    @Field("3P%") val threePointPercent: Double?,
    @Field("FT%") val freeThrowPercent: Double?,
    @Field("ORB") val offensiveRebounds: Double?,
    @Field("DRB") val defensiveRebounds: Double?,
    @Field("TRB") val totalRebounds: Double?,
    @Field("Assists") val assists: Double?,
    @Field("Steals") val steals: Double?,
    @Field("Blocks") val blocks: Double?,
    @Field("Offensive Rating") val offensiveRating: Double?,
    @Field("Defensive Rating") val defensiveRating: Double?,
    @Field("Net Rating") val netRating: Double?,
    @Field("Opponent FG%") val opponentFieldGoalPercent: Double?,
    @Field("Opponent 3P%") val opponentThreePointPercent: Double?,
    @Field("Opponent TRB") val opponentTotalRebounds: Double?,
    val year: Number
)
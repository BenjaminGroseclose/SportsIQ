package com.sportsiq.models

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "mlb-pitchers")
data class MLBPitcher(
    @Id val id: ObjectId? = null,
    var player: String?,
    var age: Int?,
    var league: String?,
    var team: String?,
    var war: Double?,
    var wins: Int?,
    var loses: Int?,
    var winLosePercentage: Double?,
    var games: Int?,
    var gameStarts: Int?,
    var gamesFinished: Int?,
    var era: Double?,
    var eraPlus: Double?,
    var shutouts: Int?,
    var saves: Int?,
    var ip: Double?,
    var hitsAllowed: Int?,
    var earnedRunsAllowed: Int?,
    var homeRunsAllowed: Int?,
    var basesOnBalls: Int?,
    var strikeouts: Int?,
    var hitsByPitch: Int?,
    var balks: Int?,
    var whip: Double?,
    var fip: Double?,
    var strikeoutsPerWalk: Double?,
    var year: Int?,
) {
}
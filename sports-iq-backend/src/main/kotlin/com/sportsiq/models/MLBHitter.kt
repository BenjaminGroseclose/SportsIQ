package com.sportsiq.models

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "mlb-hitters")
data class MLBHitter(
    @Id val id: ObjectId? = null,
    var player: String?,
    var age: Int?,
    var league: String?,
    var war: Double?,
    var games: Int?,
    var plateAppearances: Int?,
    var atBats: Int?,
    var runs: Int?,
    var hits: Int?,
    var doubles: Int?,
    var triples: Int?,
    var homeRuns: Int?,
    var rbi: Int?,
    var stolenBases: Int?,
    var caught: Int?,
    var baseOnBalls: Int?,
    var strikeouts: Int?,
    var battingAverage: Double?,
    var onBasePercentage: Double?,
    var slug: Double?,
    var opsPlus: Int?,
    var rOBA: Double?,
    var year: Int?,
) {

}
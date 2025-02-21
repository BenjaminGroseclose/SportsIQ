package com.sportsiq.models

data class NBATeam (
    val team: String?,
    val wins: Int?,
    val loses: Int?,
    val expectedWins: Int?,
    val expectedLoses: Int?,
    val marginOfVictory: Double?,
    val strengthOfSchedule: Double?,
    val simpleRatingSystem: Double?,
    val offensiveRating: Double?,
    val defensiveRating: Double?,
    val netRating: Double?,
    val pace: Double?,
    val freeThrowRate: Double?,
    val threePointRate: Double?,
    val trueShootingPercent: Double?,
    val eFieldGoalPercent: Double?,
    val turnoverPercent: Double?,
    val offensiveReboundPercent: Double?,
    val freeThrowPerFieldGoal: Double?,

    val defensiveEFieldGoalPercent: Double?,
    val defensiveTurnoverPercent: Double?,
    val defensiveReboundPercent: Double?,
    val defensiveFreeThrowPerFieldGoal: Double?,

    val year: Number
)


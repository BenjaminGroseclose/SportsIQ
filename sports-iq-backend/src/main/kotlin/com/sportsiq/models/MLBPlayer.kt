package com.sportsiq.models

import java.util.*

data class MLBPlayer(
    val playerID: Int,
    val name: String,
    val positionCategory: String,
    val position: String,
    val batHand: String,
    val throwHand: String,
    val dateOfBirth: Date
) {
}
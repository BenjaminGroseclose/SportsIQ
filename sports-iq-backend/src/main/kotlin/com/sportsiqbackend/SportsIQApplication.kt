package com.sportsiqbackend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class SportsIQApplication

fun main(args: Array<String>) {
    runApplication<SportsIQApplication>(*args)
}

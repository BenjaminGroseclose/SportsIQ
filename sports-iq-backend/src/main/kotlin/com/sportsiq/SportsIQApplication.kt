package com.sportsiq

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration
import org.springframework.boot.runApplication

@SpringBootApplication(exclude = [SecurityAutoConfiguration::class, UserDetailsServiceAutoConfiguration::class])
class SportsIQApplication

fun main(args: Array<String>) {
    runApplication<SportsIQApplication>(*args)
}

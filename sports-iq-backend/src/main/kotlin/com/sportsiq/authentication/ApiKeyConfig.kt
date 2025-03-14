package com.sportsiq.authentication

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsUtils

@Configuration
@EnableWebSecurity
class ApiKeyConfig {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http.csrf({ csrf -> csrf.disable() })
            .authorizeHttpRequests({
                request -> request.requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
            })
            .authorizeHttpRequests({
                request -> request.requestMatchers("/**").authenticated()
            })
            .httpBasic(Customizer.withDefaults())
            .sessionManagement({ session -> session.sessionCreationPolicy((SessionCreationPolicy.STATELESS)) })
            .addFilterBefore(ApiKeyAuthenticationFilter(), UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }
}
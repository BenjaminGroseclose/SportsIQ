package com.sportsiq.authentication

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class CorsConfiguration : WebMvcConfigurer {

    @Bean
    fun corsConfigurer(): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry.addMapping("/**") // Apply to all endpoints
                    .allowedOrigins("http://localhost:4200/") // Allow requests from this origin
                    .allowedMethods("GET", "POST", "PUT", "DELETE") // Allowed HTTP methods
                    .allowedHeaders("*") // Allowed headers
                    .allowCredentials(true) // Allow credentials
            }
        }
    }
}
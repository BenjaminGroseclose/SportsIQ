package com.sportsiqbackend.Authentication

import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority

// Only create if ApiKey is valid
class ApiKeyAuthentication(private val apiKey: String) : Authentication {
    override fun getName(): String {
        return apiKey
    }

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return mutableListOf()
    }

    override fun getCredentials(): Any {
        return apiKey
    }

    override fun getDetails(): Any {
        return ""
    }

    override fun getPrincipal(): Any {
        return apiKey
    }

    override fun isAuthenticated(): Boolean {
        return true // Assuming the apiKey is valid
    }

    override fun setAuthenticated(isAuthenticated: Boolean) {
        TODO("Not yet implemented")
    }
}
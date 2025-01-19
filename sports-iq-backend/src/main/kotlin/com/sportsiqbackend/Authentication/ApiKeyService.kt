package com.sportsiqbackend.Authentication

import org.springframework.stereotype.Service

@Service
class ApiKeyService {
    companion object { const val VALID_API_KEY = "valid-api-key" } // TODO: Replace or fetch from environment variables

    fun isValidApiKey(apiKey: String): Boolean {
        return VALID_API_KEY == apiKey
    }
}
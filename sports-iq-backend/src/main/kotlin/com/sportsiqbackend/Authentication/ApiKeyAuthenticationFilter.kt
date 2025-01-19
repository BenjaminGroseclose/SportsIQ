package com.sportsiqbackend.Authentication

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class ApiKeyAuthenticationFilter(private val apiKeyService: ApiKeyService): OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val apiKey: String = request.getHeader("X-API-KEY")

        if (apiKey.isNotEmpty() && apiKeyService.isValidApiKey(apiKey)) {
            val auth = ApiKeyAuthentication(apiKey)
            SecurityContextHolder.getContext().authentication = auth
        }
        else {
            response.status = HttpServletResponse.SC_UNAUTHORIZED
            return;
        }

        filterChain.doFilter(request, response)
    }
}
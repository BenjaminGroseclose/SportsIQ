package com.sportsiq.authentication

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class ApiKeyAuthenticationFilter: OncePerRequestFilter() {
    companion object { const val VALID_API_KEY = "valid-api-key" }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val apiKey: String = request.getHeader("X-API-KEY")

        if (apiKey.isNotEmpty() && VALID_API_KEY == apiKey) {
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
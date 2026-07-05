package com.HealthAi.filter;

import com.HealthAi.service.JwtService;
import com.HealthAi.service.TokenBlackListService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final TokenBlackListService tokenBlackListService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        if (tokenBlackListService.isBlacklisted(token)) {
            response.setStatus(401);
            response.getWriter()
                    .write("Token blacklist ho chuka hai!");
            return;
        }

        try {
            String email = jwtService.extractEmail(token);

            if (email != null &&
                    SecurityContextHolder.getContext()
                            .getAuthentication() == null) {

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                email, null, List.of());

                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);
            }
        } catch (Exception e) {
            // Invalid token — ignore
        }

        filterChain.doFilter(request, response);
    }
}
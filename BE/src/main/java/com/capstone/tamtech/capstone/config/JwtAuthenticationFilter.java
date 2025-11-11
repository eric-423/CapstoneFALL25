package com.capstone.tamtech.capstone.config;

import com.capstone.tamtech.capstone.untils.JwtTokenHelper;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenHelper jwtTokenHelper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // Remove "Bearer " prefix
        }

        if (token != null && jwtTokenHelper.verifyToken(token)) {
            try {
                Claims claims = jwtTokenHelper.getClaimsFromToken(token);

                String role = claims.get("role", String.class);
                Integer userId = claims.get("id", Integer.class);
                String email = claims.get("email", String.class);
                String phone = claims.get("phone", String.class);

                String principal = email != null && !email.isEmpty() ? email : phone;

                if (role != null && principal != null) {
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            principal,
                            null,
                            Collections.singletonList(authority));

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    System.out.println(
                            "✅ JWT Auth Success - User: " + principal + ", Role: " + role + ", UserId: " + userId);
                }
            } catch (Exception e) {
                System.out.println("❌ JWT Auth Failed: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}

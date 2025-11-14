package com.capstone.tamtech.capstone.config;

import com.capstone.tamtech.capstone.untils.JwtTokenHelper;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Collections;
import java.util.Map;

@Component
public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

    @Autowired
    private JwtTokenHelper jwtTokenHelper;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
            WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
            HttpServletRequest httpRequest = servletRequest.getServletRequest();

            response.getHeaders().add("Access-Control-Allow-Origin", "*");
            response.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.getHeaders().add("Access-Control-Allow-Headers", "*");
            response.getHeaders().add("Access-Control-Allow-Credentials", "true");

            String token = extractToken(httpRequest);

            if (token != null && jwtTokenHelper.verifyToken(token)) {
                try {
                    Claims claims = jwtTokenHelper.getClaimsFromToken(token);

                    String role = claims.get("role", String.class);
                    Integer userId = claims.get("id", Integer.class);
                    String email = claims.get("email", String.class);
                    String phone = claims.get("phone", String.class);

                    String principal = email != null && !email.isEmpty() ? email : phone;

                    if (role != null && principal != null) {
                        attributes.put("userId", userId);
                        attributes.put("email", email);
                        attributes.put("phone", phone);
                        attributes.put("role", role);
                        attributes.put("principal", principal);

                        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                principal,
                                null,
                                Collections.singletonList(authority));

                        SecurityContextHolder.getContext().setAuthentication(authentication);

                        System.out.println("✅ WebSocket authentication successful for user: " + principal);
                        return true;
                    }
                } catch (Exception e) {
                    System.out.println("❌ WebSocket JWT Auth Failed: " + e.getMessage());
                    return true;
                }
            } else {
                System.out.println("⚠️ WebSocket connection without authentication");
                return true;
            }
        }

        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
            WebSocketHandler wsHandler, Exception exception) {
        if (exception != null) {
            System.out.println("❌ WebSocket handshake error: " + exception.getMessage());
        } else {
            System.out.println("✅ WebSocket handshake completed successfully");
        }
    }

    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        String token = request.getParameter("token");
        if (token != null && !token.isEmpty()) {
            return token;
        }

        String protocol = request.getHeader("Sec-WebSocket-Protocol");
        if (protocol != null && protocol.startsWith("Bearer ")) {
            return protocol.substring(7);
        }

        return null;
    }
}

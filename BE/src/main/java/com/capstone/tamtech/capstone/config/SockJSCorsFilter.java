package com.capstone.tamtech.capstone.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SockJSCorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI();

        if (path != null && (path.startsWith("/ws") || path.startsWith("/ws/"))) {
            String origin = httpRequest.getHeader("Origin");
            String upgrade = httpRequest.getHeader("Upgrade");
            String connection = httpRequest.getHeader("Connection");

            if (origin != null) {
                httpResponse.setHeader("Access-Control-Allow-Origin", origin);
            } else {
                httpResponse.setHeader("Access-Control-Allow-Origin", "*");
            }

            httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            httpResponse.setHeader("Access-Control-Allow-Headers",
                    "Authorization, Content-Type, X-Requested-With, Origin, Accept, Upgrade, Connection, Sec-WebSocket-Key, Sec-WebSocket-Version, Sec-WebSocket-Protocol, Sec-WebSocket-Extensions");
            httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
            httpResponse.setHeader("Access-Control-Max-Age", "3600");

            if ("websocket".equalsIgnoreCase(upgrade) &&
                    connection != null && connection.toLowerCase().contains("upgrade")) {
                httpResponse.setHeader("Upgrade", "websocket");
                httpResponse.setHeader("Connection", "Upgrade");
            }

            if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
                httpResponse.setStatus(HttpServletResponse.SC_OK);
                return;
            }
        }

        chain.doFilter(request, response);
    }
}

package com.capstone.tamtech.capstone.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html",
                                "/swagger-resources/**",
                                "/webjars/**")
                        .permitAll()

                        .requestMatchers("/api/auth/**").permitAll()

                        .requestMatchers("/api/branches/nearby").permitAll()
                        .requestMatchers("/api/combos/search").permitAll()
                        .requestMatchers("/api/products/search").permitAll()
                        .requestMatchers("/api/product-types", "/api/product-types/{id}").permitAll()
                        .requestMatchers("/api/payment-method").permitAll()
                        .requestMatchers("/api/orders/shipping/fee").permitAll()
                        .requestMatchers("/api/orders/payment/webhook").permitAll()

                        .requestMatchers("/api/product-types/create").hasRole("ADMIN")
                        .requestMatchers("/api/product-types/update/**").hasRole("ADMIN")

                        .requestMatchers("/api/products/create").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/api/products/update/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/api/orders/manager/**").hasAnyRole("MANAGER", "ADMIN")

                        .requestMatchers("/api/orders/waiter/**").hasRole("WAITER")
                        .requestMatchers("/api/table/**").hasAnyRole("WAITER", "MANAGER", "ADMIN")

                        .requestMatchers("/api/orders/cheff/**").hasRole("CHEF")

                        .requestMatchers("/api/orders/shipper/**").hasRole("SHIPPER")

                        .requestMatchers("/api/customers/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/orders/customer/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/orders/dining-table/**").hasRole("CUSTOMER")

                        .requestMatchers("/api/orders/customer/pickup").hasAnyRole("CUSTOMER", "STAFF")

                        .requestMatchers(HttpMethod.POST, "/api/orders").hasRole("CUSTOMER")

                        .anyRequest().authenticated());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(false);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

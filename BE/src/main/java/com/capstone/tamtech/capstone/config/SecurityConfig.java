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

                        .requestMatchers(HttpMethod.GET, "/api/branches/nearby").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/branches/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/branches").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/branches").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/branches/{id}").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/branches/{id}/activate").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/branches/{id}/deactivate").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/branches/add-product/{id}")
                        .hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers("/api/combos/search").permitAll()
                        .requestMatchers("/api/products/search").permitAll()
                        .requestMatchers("/api/product-types", "/api/product-types/{id}").permitAll()
                        .requestMatchers("/api/payment-method").permitAll()
                        .requestMatchers("/api/orders/shipping/fee").permitAll()
                        .requestMatchers("/api/orders/payment/webhook").permitAll()
                        .requestMatchers("/api/orders/dining-table/create").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/api/orders/*/shipper-location").permitAll()

                        // Public statistics for customers
                        .requestMatchers("/api/statistics/top-selling").permitAll()
                        .requestMatchers("/api/statistics/item-sales").permitAll()

                        .requestMatchers("/api/product-types/create").hasRole("ADMIN")
                        .requestMatchers("/api/product-types/update/**").hasRole("ADMIN")

                        .requestMatchers("/api/products/create").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/api/products/update/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/api/orders/manager/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/api/statistics/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/api/promotions/create").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/api/promotions/assign").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/api/promotions/all").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/api/promotions/*").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/api/promotions/*/status").hasAnyRole("MANAGER", "ADMIN")

                        .requestMatchers("/api/orders/waiter/**").hasRole("WAITER")
                        .requestMatchers("/api/table/**").hasAnyRole("WAITER", "MANAGER", "ADMIN")

                        .requestMatchers("/api/orders/cheff/**").hasRole("CHEF")

                        .requestMatchers("/api/orders/shipper/**").hasRole("SHIPPER")
                        .requestMatchers("/api/shipper/orders/*/location").hasRole("SHIPPER")

                        .requestMatchers("/api/orders/branch/**")
                        .hasAnyRole("MANAGER", "ADMIN", "WAITER", "CHEF", "SHIPPER")
                        .requestMatchers("/api/orders/statuses").permitAll()

                        .requestMatchers("/api/orders/customer/pickup").hasAnyRole("CUSTOMER", "STAFF")
                        .requestMatchers("/api/orders/customer/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/customers/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/orders/dining-table/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/promotions/customer/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/roles/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/orders").hasRole("CUSTOMER")

                        .anyRequest().authenticated());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

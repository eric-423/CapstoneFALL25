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

    @Autowired
    private SockJSCorsFilter sockJSCorsFilter;

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
                .addFilterBefore(sockJSCorsFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html",
                                "/swagger-resources/**",
                                "/webjars/**")
                        .permitAll()

                        .requestMatchers("/auth/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/branches/nearby").permitAll()
                        .requestMatchers(HttpMethod.GET, "/branches/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/branches").permitAll()
                        .requestMatchers(HttpMethod.POST, "/branches").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/branches/{id}").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/branches/{id}/activate").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/branches/{id}/deactivate").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.POST, "/branches/{id}/products").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/branches/add-product/{id}")
                        .hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.GET, "/branches/statistics")
                        .hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers("/cart-items/**").hasAnyRole("CUSTOMER")

                        .requestMatchers(HttpMethod.GET, "/warehouses")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.GET, "/warehouses/{id}")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.GET, "/warehouses/{id}/materials")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.POST, "/warehouses").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/warehouses/{id}").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.POST, "/warehouses/{id}/materials")
                        .hasAnyRole("ADMIN", "MANAGER", "CHEFF")
                        .requestMatchers(HttpMethod.PUT, "/warehouses/{id}/materials")
                        .hasAnyRole("ADMIN", "MANAGER", "CHEFF")

                        .requestMatchers(HttpMethod.GET, "/material-types")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.GET, "/material-types/{id}")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.POST, "/material-types").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/material-types/{id}").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/material-types/{id}").hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(HttpMethod.GET, "/materials")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.GET, "/materials/{id}")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.POST, "/materials").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/materials/{id}").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/materials/{id}").hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(HttpMethod.GET, "/nutrients")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.GET, "/nutrients/{id}")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.POST, "/nutrients").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/nutrients/{id}").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/nutrients/{id}").hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(HttpMethod.GET, "/utensils-types")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.GET, "/utensils-types/{id}")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.POST, "/utensils-types").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/utensils-types/{id}").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/utensils-types/{id}").hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(HttpMethod.GET, "/cooking-utensils")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.GET, "/cooking-utensils/{id}")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.POST, "/cooking-utensils").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/cooking-utensils/{id}").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/cooking-utensils/{id}").hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(HttpMethod.GET, "/units")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.GET, "/units/{id}")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.POST, "/units").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/units/{id}").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/units/{id}").hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(HttpMethod.GET, "/shifts")
                        .hasAnyRole("MANAGER", "ADMIN", "STAFF", "CHEFF", "WAITER", "SHIPPER")
                        .requestMatchers(HttpMethod.GET, "/shifts/{id}")
                        .hasAnyRole("MANAGER", "ADMIN", "STAFF", "CHEFF", "WAITER", "SHIPPER")
                        .requestMatchers(HttpMethod.POST, "/shifts").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/shifts/{id}").hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(HttpMethod.GET, "/cooking-methods")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.GET, "/cooking-methods/**")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.POST, "/cooking-methods")
                        .hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/cooking-methods/**")
                        .hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(HttpMethod.GET, "/cooking-method-nutrients")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.GET, "/cooking-method-nutrients/**")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.POST, "/cooking-method-nutrients")
                        .hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/cooking-method-nutrients/**")
                        .hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/cooking-method-nutrients/**")
                        .hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(HttpMethod.GET, "/material-nutrients")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.GET, "/material-nutrients/**")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.POST, "/material-nutrients").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/material-nutrients/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/material-nutrients/**").hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(HttpMethod.GET, "/trainings/me")
                        .hasAnyRole("ADMIN", "MANAGER", "STAFF", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.GET, "/trainings/me/**")
                        .hasAnyRole("ADMIN", "MANAGER", "STAFF", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.POST, "/trainings/me/**")
                        .hasAnyRole("ADMIN", "MANAGER", "STAFF", "CHEFF", "WAITER")

                        .requestMatchers(HttpMethod.GET, "/trainings")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.GET, "/trainings/{id}")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.POST, "/trainings").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/trainings/{id}").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/trainings/{id}").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers("/trainings/admin/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers("/lessons/admin/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers("/documents/admin/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers("/user-trainings/admin/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers("/me/**").hasAnyRole("ADMIN", "MANAGER", "STAFF", "CHEFF", "WAITER")
                        .requestMatchers("/user-trainings/me/**")
                        .hasAnyRole("ADMIN", "MANAGER", "STAFF", "CHEFF", "WAITER")
                        .requestMatchers("/lessons/me/**")
                        .hasAnyRole("ADMIN", "MANAGER", "STAFF", "CHEFF", "WAITER")

                        .requestMatchers("/combos/search").permitAll()
                        .requestMatchers("/products/detail/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/combos/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/combos").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/combos/{id}").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/combos/{id}").hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(HttpMethod.GET, "/order-statuses").permitAll()
                        .requestMatchers(HttpMethod.GET, "/order-statuses/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/order-statuses").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/order-statuses/{id}").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/order-statuses/{id}").hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers("/products/search").permitAll()
                        .requestMatchers("/products/all-branch/search").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/product-types", "/product-types/{id}").permitAll()
                        .requestMatchers("/payment-method").permitAll()
                        .requestMatchers("/orders/shipping/fee").permitAll()
                        .requestMatchers("/orders/payment/webhook").permitAll()
                        .requestMatchers("/orders/payment/cancel").permitAll()
                        .requestMatchers("/orders/dining-table/create").permitAll()
                        .requestMatchers("/orders/dining-table/update/**").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/orders/*/shipper-location").permitAll()

                        .requestMatchers("/statistics/top-selling").permitAll()
                        .requestMatchers("/statistics/item-sales").permitAll()

                        .requestMatchers("/product-types/create").hasRole("ADMIN")
                        .requestMatchers("/product-types/update/**").hasRole("ADMIN")

                        .requestMatchers("/products/create").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/products/update/**").hasAnyRole("MANAGER", "ADMIN")

                        .requestMatchers(HttpMethod.GET, "/recipes/**")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER")
                        .requestMatchers(HttpMethod.POST, "/recipes/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/recipes/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/recipes/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/orders/staff/**").hasAnyRole("MANAGER", "ADMIN", "STAFF")
                        .requestMatchers("/statistics/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/promotions/create").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/promotions/assign").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/promotions/all").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/promotions/available/order-amout")
                        .hasAnyRole("MANAGER", "ADMIN", "CHEFF", "WAITER", "CUSTOMER", "STAFF")
                        .requestMatchers("/promotions/*").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/promotions/*/status").hasAnyRole("MANAGER", "ADMIN")

                        .requestMatchers("/orders/waiter/**").hasRole("WAITER")

                        .requestMatchers(HttpMethod.GET, "/table/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/table/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/table/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PATCH, "/table/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/table/**").hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers("/orders/cheff/**").hasRole("CHEFF")

                        .requestMatchers("/orders/shipper/**").hasRole("SHIPPER")
                        .requestMatchers("/shipper/orders/*/location").hasRole("SHIPPER")

                        .requestMatchers("/orders/branch/**")
                        .hasAnyRole("MANAGER", "ADMIN", "WAITER", "CHEFF", "SHIPPER", "STAFF")
                        .requestMatchers("/orders/statuses").permitAll()

                        .requestMatchers("/orders/customer/pickup").hasAnyRole("CUSTOMER", "STAFF")
                        .requestMatchers("/orders/customer/**").hasRole("CUSTOMER")
                        .requestMatchers("/customers/**").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.POST, "/orders/dining-table/payment/**")
                        .hasAnyRole("WAITER", "ADMIN", "MANAGER", "STAFF")
                        .requestMatchers("/orders/dining-table/**").hasRole("CUSTOMER")
                        .requestMatchers("/promotions/customer/**").hasRole("CUSTOMER")

                        .requestMatchers(HttpMethod.GET, "/orders/*/bill/download")
                        .hasAnyRole("ADMIN", "MANAGER", "WAITER", "CUSTOMER", "STAFF")
                        .requestMatchers(HttpMethod.POST, "/orders/*/bill/regenerate")
                        .hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(HttpMethod.GET, "/roles").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers("/roles/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/roles/{roleId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/roles/{roleId}").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/users/statistics").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.GET, "/users/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/users/{userId}").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/users/{userId}/ban").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers("/users/**").hasRole("ADMIN")
                        .requestMatchers("/role-histories/update/test/role-names").permitAll()
                        .requestMatchers("/role-histories/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/orders").hasRole("CUSTOMER")

                        .requestMatchers(HttpMethod.POST, "/attendance/check-in")
                        .hasAnyRole("ADMIN", "MANAGER", "STAFF", "CHEFF", "WAITER", "SHIPPER")
                        .requestMatchers(HttpMethod.POST, "/attendance/check-out")
                        .hasAnyRole("ADMIN", "MANAGER", "STAFF", "CHEFF", "WAITER", "SHIPPER")
                        .requestMatchers(HttpMethod.GET, "/attendance")
                        .hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.GET, "/attendance/summary")
                        .hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers("/promotion-types/**").hasAnyRole("MANAGER", "ADMIN")

                        .requestMatchers(HttpMethod.POST, "/schedules/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/schedules/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers("/schedules/**").hasAnyRole("ADMIN", "MANAGER", "STAFF", "CHEFF", "WAITER")

                        .requestMatchers("/dashboard/**").hasAnyRole("ADMIN", "MANAGER")
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

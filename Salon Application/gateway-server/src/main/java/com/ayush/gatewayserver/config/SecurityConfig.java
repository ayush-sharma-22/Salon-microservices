package com.ayush.gatewayserver.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Mono;
import java.util.Arrays;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

        http.cors(corsSpec -> corsSpec.configurationSource(corsConfigurationSource()))
            .authorizeExchange(exchange ->
                exchange.pathMatchers("/auth/**").permitAll()
                        .pathMatchers("/api/notifications/ws/**").permitAll()
                        .pathMatchers("/api/payments/proceed/**").permitAll()
                        .pathMatchers(
                                "/api/categories/salon-owner/**",
                                "/api/notifications/salon-owner/**",
                                "/api/service-offering/salon-owner/**"  // ← added /
                        ).hasAnyRole("OWNER")
                        .pathMatchers(
                                "/api/salons/**",
                                "/api/salon/**",
                                "/api/categories/**",
                                "/api/service-offering/**",
                                "/api/bookings/**",                     // ← added /
                                "/api/notifications/**",
                                "/api/users/**"
                        ).hasAnyRole("CUSTOMER", "OWNER", "ADMIN")
                                         // ← add this
        ).oauth2ResourceServer(oAuth2ResourceServerSpec -> oAuth2ResourceServerSpec
                .jwt(jwtSpec -> jwtSpec.jwtAuthenticationConverter(grantAuthoritiesExtractor()))
        ).csrf(ServerHttpSecurity.CsrfSpec::disable);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
        corsConfig.setMaxAge(3600L);
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        corsConfig.setAllowedHeaders(Arrays.asList("*"));
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        return source;
    }

    private Converter<Jwt,? extends Mono<? extends AbstractAuthenticationToken>> grantAuthoritiesExtractor() {
        JwtAuthenticationConverter jwtAuthenticationConverter =
                new JwtAuthenticationConverter();

        jwtAuthenticationConverter.
                setJwtGrantedAuthoritiesConverter(new KeycloakRoleConvertor());

        return new ReactiveJwtAuthenticationConverterAdapter(jwtAuthenticationConverter);
    }
}

package com.example.gateway.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain filterChain(ServerHttpSecurity http) {
        return http
                .cors(cors -> cors.disable())                    // ✅ CORS 필터 비활성화
                .httpBasic(httpBasic -> httpBasic.disable())     // ✅ Basic 인증 비활성화
                .csrf(ServerHttpSecurity.CsrfSpec::disable)      // ✅ CSRF 비활성화
                .authorizeExchange(auth -> auth
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()  // ✅ OPTIONS 허용
                        .pathMatchers("/api/auth/**", "/api/mail/**").permitAll()
                        .anyExchange().permitAll()
                )
                .build();
    }
}

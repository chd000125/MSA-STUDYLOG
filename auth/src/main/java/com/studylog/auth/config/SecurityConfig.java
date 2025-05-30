package com.studylog.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.disable())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // 인증 관련 API
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/auth/register/**").permitAll()
                .requestMatchers("/api/auth/restore").permitAll()
                .requestMatchers("/api/auth/refresh").permitAll()
                
                // 메일 인증 관련 API
                .requestMatchers("/api/mail/**").permitAll()
                
                // 기타 API는 인증 필요
                .anyRequest().permitAll()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        
        return http.build();
    }
}
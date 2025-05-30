//package com.studylog.users.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins("http://localhost:9090")
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
//                .allowedHeaders(
//                    "Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin",
//                    "Access-Control-Request-Method", "Access-Control-Request-Headers", "X-User-Email"
//                )
//                .exposedHeaders("Authorization", "Set-Cookie")
//                .allowCredentials(true)
//                .maxAge(3600);
//    }
//}
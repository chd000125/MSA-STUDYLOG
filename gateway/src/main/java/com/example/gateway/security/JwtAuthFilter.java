//package com.example.gateway.security;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.cloud.gateway.filter.GatewayFilterChain;
//import org.springframework.cloud.gateway.filter.GlobalFilter;
//import org.springframework.core.Ordered;
//import org.springframework.http.HttpMethod;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.server.reactive.ServerHttpRequest;
//import org.springframework.stereotype.Component;
//import org.springframework.web.server.ServerWebExchange;
//import reactor.core.publisher.Mono;
//import org.springframework.http.HttpHeaders;
//
//import java.nio.charset.StandardCharsets;
//
//@Component
//public class JwtAuthFilter implements GlobalFilter, Ordered {
//
//    private static final String SECRET_KEY = "jwt.secret=a-string-secret-at-least-256-bits-long";
//
//    @Override
//    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
//        ServerHttpRequest request = exchange.getRequest();
//
//        // ✅ [1] OPTIONS 요청 무조건 통과
//        if (request.getMethod() == HttpMethod.OPTIONS) {
//            System.out.println("✅ OPTIONS 요청 허용");
//            return chain.filter(exchange);
//        }
//
//        // ✅ [2] 인증 없이 허용할 경로
//        String path = request.getURI().getPath();
//        if (path.startsWith("/api/auth/") || path.startsWith("/api/mail/")) {
//            System.out.println("✅ 화이트리스트 경로 통과: " + path);
//            return chain.filter(exchange);
//        }
//
//        // ✅ [3] Authorization 헤더 확인
//        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            System.out.println("⛔ Authorization 헤더 없음 또는 형식 오류");
//            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
//            return exchange.getResponse().setComplete();
//        }
//
//        try {
//            String token = authHeader.substring(7);
//            Claims claims = Jwts.parserBuilder()
//                    .setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8)))
//                    .build()
//                    .parseClaimsJws(token)
//                    .getBody();
//
//            ServerHttpRequest mutatedRequest = request.mutate()
//                    .header("X-User-Email", claims.get("email", String.class))
//                    .build();
//
//            ServerWebExchange mutatedExchange = exchange.mutate().request(mutatedRequest).build();
//            return chain.filter(mutatedExchange);
//
//        } catch (Exception e) {
//            System.out.println("⛔ JWT 파싱 실패: " + e.getMessage());
//            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
//            return exchange.getResponse().setComplete();
//        }
//    }
//
//    @Override
//    public int getOrder() {
//        return -1; // ✅ CorsWebFilter보다 먼저 실행됨
//    }
//}

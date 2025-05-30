//package com.example.gateway.security;
//import org.springframework.cloud.gateway.filter.GlobalFilter;
//import org.springframework.core.Ordered;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.server.reactive.ServerHttpRequest;
//import org.springframework.stereotype.Component;
//import org.springframework.web.server.ServerWebExchange;
//import reactor.core.publisher.Mono;
//
//@Component
//public class JsonOnlyGlobalFilter implements GlobalFilter, Ordered {
//
//    @Override
//    public Mono<Void> filter(ServerWebExchange exchange, org.springframework.cloud.gateway.filter.GatewayFilterChain chain) {
//        ServerHttpRequest request = exchange.getRequest();
//        String contentType = request.getHeaders().getFirst("Content-Type");
//
//        if (request.getMethod() != null && (
//                request.getMethod().name().equalsIgnoreCase("POST") ||
//                        request.getMethod().name().equalsIgnoreCase("PUT"))
//        ) {
//            if (contentType == null || !contentType.contains("application/json")) {
//                exchange.getResponse().setStatusCode(HttpStatus.UNSUPPORTED_MEDIA_TYPE); // 415
//                return exchange.getResponse().setComplete();
//            }
//        }
//
//        return chain.filter(exchange);
//    }
//
//    @Override
//    public int getOrder() {
//        return -1; // 다른 필터보다 먼저 실행
//    }
//}
//
//

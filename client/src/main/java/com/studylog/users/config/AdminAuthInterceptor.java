package com.studylog.users.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.studylog.users.util.JwtToken;

@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    private final JwtToken jwtToken;

    public AdminAuthInterceptor(JwtToken jwtToken) {
        this.jwtToken = jwtToken;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true; // 프리플라이트는 무조건 통과
        }
        String token = request.getHeader("Authorization");

        if (token == null || !token.startsWith("Bearer ")) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return false;
        }

        token = token.substring(7);
        String uRole = jwtToken.getuRole(token);

        if (!"ADMIN".equals(uRole)) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            return false;
        }

        return true;
    }
}
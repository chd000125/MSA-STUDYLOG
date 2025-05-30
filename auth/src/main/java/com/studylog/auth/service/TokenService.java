package com.studylog.auth.service;

import com.studylog.auth.util.JwtToken;
import com.studylog.auth.entity.User;
import com.studylog.auth.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

/**
 * 액세스 토큰 재발급 서비스
 */
@Slf4j
@Service
public class TokenService {

    private final JwtToken jwtToken;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;

    public TokenService(JwtToken jwtToken,
                        RedisTemplate<String, String> redisTemplate,
                        UserRepository userRepository) {
        this.jwtToken = jwtToken;
        this.redisTemplate = redisTemplate;
        this.userRepository = userRepository;
    }

    @Transactional
    public Map<String, String> refreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            throw new IllegalArgumentException("리프레시 토큰 쿠키가 없습니다.");
        }

        // 1. 쿠키 정보 로깅
        log.info("요청에 포함된 쿠키 수: {}", cookies.length);
        for (Cookie cookie : cookies) {
            log.info("쿠키 이름: {}, 값: {}", cookie.getName(), cookie.getValue());
        }

        String refreshToken = null;
        for (Cookie cookie : cookies) {
            if ("refreshToken".equals(cookie.getName())) {
                refreshToken = cookie.getValue();
                break;
            }
        }
        // 2. 추출된 refreshToken 로깅
        log.info("요청에서 추출된 refreshToken: {}", refreshToken);

        if (refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalArgumentException("리프레시 토큰이 필요합니다.");
        }

        Long uId = jwtToken.getuId(refreshToken);
        String storedRefreshToken = redisTemplate.opsForValue().get("refresh:" + uId);
        // 3. Redis에서 가져온 refreshToken 로깅
        log.info("Redis에서 가져온 refreshToken: {}", storedRefreshToken);
        if (storedRefreshToken == null || !storedRefreshToken.equals(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다.");
        }

        User user = userRepository.findById(uId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        String newAccessToken = jwtToken.generateAccessToken(user);
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", newAccessToken);

        return tokens;
    }
}
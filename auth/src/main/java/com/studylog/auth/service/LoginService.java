package com.studylog.auth.service;

import com.studylog.auth.util.JwtToken;
import com.studylog.auth.dto.LoginRequestDto;
import com.studylog.auth.entity.User;
import com.studylog.auth.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class LoginService {
    private final UserRepository userRepository;
    private final JwtToken jwtToken;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, String> redisTemplate;

    public LoginService(UserRepository userRepository, JwtToken jwtToken, PasswordEncoder passwordEncoder, RedisTemplate<String, String> redisTemplate) {
        this.userRepository = userRepository;
        this.jwtToken = jwtToken;
        this.passwordEncoder = passwordEncoder;
        this.redisTemplate = redisTemplate;
    }

    public Map<String, Object> handleLogin(LoginRequestDto request, HttpServletResponse response) {
        Map<String, Object> result = new HashMap<>();

        Optional<User> userOptional = userRepository.findByuEmail(request.getuEmail());
        if (userOptional.isEmpty()) {
            result.put("error", "잘못된 이메일 또는 비밀번호입니다.");
            result.put("status", HttpStatus.UNAUTHORIZED.value());
            return result;
        }

        User user = userOptional.get();
        log.info("로그인된 사용자 ID: {}", user.getuId());
        if (!passwordEncoder.matches(request.getuPassword(), user.getuPassword())) {
            result.put("error", "잘못된 이메일 또는 비밀번호입니다.");
            result.put("status", HttpStatus.UNAUTHORIZED.value());
            return result;
        }

        if (user.getDeletedAt() != null) {
            LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
            if (user.getDeletedAt().isBefore(thirtyDaysAgo)) {
                result.put("error", "삭제된 계정입니다.");
                result.put("status", HttpStatus.UNAUTHORIZED.value());
                return result;
            }
            result.put("deletedAt", user.getDeletedAt().toString());
            result.put("message", "삭제 예정인 계정입니다. 계정 복구 페이지로 이동합니다.");
            result.put("status", HttpStatus.OK.value());
            return result;
        }

        String accessToken = jwtToken.generateAccessToken(user);
        String refreshToken = jwtToken.generateRefreshToken(user);

        log.info("레디스 저장 키: refresh:{}, 토큰: {}", user.getuId(), refreshToken);
        redisTemplate.opsForValue().set("refresh:" + user.getuId(), refreshToken, Duration.ofDays(7));

        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge((int) Duration.ofDays(7).getSeconds());
        refreshCookie.setSecure(true);
        refreshCookie.setAttribute("SameSite", "Lax");
        response.addCookie(refreshCookie);

        result.put("accessToken", accessToken);
        result.put("uName", user.getuName());
        result.put("uEmail", user.getuEmail());
        result.put("uRole", user.getuRole());
        result.put("status", HttpStatus.OK.value());
        return result;
    }

    public void handleLogout(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = resolveToken(request);
        if (accessToken == null) {
            log.warn("Authorization 헤더가 비어있거나 Bearer 토큰이 아님");
            return;
        }

        Long uId;
        try {
            uId = jwtToken.getuId(accessToken);
        } catch (ExpiredJwtException e) {
            uId = Long.valueOf(e.getClaims().get("uId").toString());
            log.info("만료된 토큰에서 uId 추출: {}", uId);
        } catch (Exception e) {
            log.warn("토큰 파싱 실패", e);
            return;
        }

        String redisKey = "refresh:" + uId;
        Boolean deleted = redisTemplate.delete(redisKey);
        if (Boolean.TRUE.equals(deleted)) {
            log.info("로그아웃 처리 완료 - Redis 키 삭제됨: {}", redisKey);
        } else {
            log.warn("Redis 키 삭제 실패 또는 존재하지 않음: {}", redisKey);
        }

        // 리프레시 토큰 쿠키 삭제
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    Cookie deleteCookie = new Cookie("refreshToken", null);
                    deleteCookie.setMaxAge(0);
                    deleteCookie.setPath("/");
                    deleteCookie.setHttpOnly(true);
                    deleteCookie.setSecure(true);
                    deleteCookie.setDomain("localhost"); // 도메인 설정
                    deleteCookie.setAttribute("SameSite", "Strict"); // SameSite를 Strict로 변경
                    response.addCookie(deleteCookie);
                    log.info("리프레시 토큰 쿠키 삭제 완료");
                    break;
                }
            }
        }
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
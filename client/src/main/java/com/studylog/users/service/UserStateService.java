package com.studylog.users.service;

import com.studylog.users.util.JwtToken;
import com.studylog.users.entity.User;
import com.studylog.users.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.redis.core.RedisTemplate;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service
public class UserStateService {
    private final UserRepository userRepository;
    private final JwtToken jwtToken;
    private final RedisTemplate<String, String> redisTemplate;

    public UserStateService(UserRepository userRepository,
                            JwtToken jwtToken,
                            RedisTemplate<String, String> redisTemplate) {
        this.userRepository = userRepository;
        this.jwtToken = jwtToken;
        this.redisTemplate = redisTemplate;
    }

    @Transactional
    public Map<String, String> deleteAccount(String uEmail, String token) {
        log.info("계정 삭제 요청 - email: {}", uEmail);

        if (token == null || !token.startsWith("Bearer ")) {
            throw new RuntimeException("인증이 필요합니다.");
        }

        String accessToken = token.substring(7);
        String tokenEmail = jwtToken.getuEmail(accessToken);
        log.info("토큰에서 추출한 이메일: {}", tokenEmail);

        if (!tokenEmail.equals(uEmail)) {
            throw new RuntimeException("다른 사용자의 계정을 삭제할 수 없습니다.");
        }

        User user = userRepository.findByuEmail(uEmail)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        LocalDateTime now = LocalDateTime.now();
        user.setDeletedAt(now);
        userRepository.save(user);
        log.info("계정 소프트 삭제 완료 - email: {}, 삭제일시: {}", uEmail, now);

        String redisKey = "refresh:" + user.getuId();
        redisTemplate.delete(redisKey);
        log.info("리프레시 토큰 삭제 완료 - key: {}", redisKey);

        return Map.of("message", "회원 탈퇴가 신청되었습니다. 30일 후 계정이 삭제됩니다.");
    }

    @Transactional
    public Map<String, String> restoreAccount(String uEmail) {
        log.info("계정 복구 요청 - email: {}", uEmail);

        if (uEmail == null || uEmail.trim().isEmpty()) {
            throw new RuntimeException("이메일이 필요합니다.");
        }

        User user = userRepository.findByuEmail(uEmail.trim())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (user.getDeletedAt() == null) {
            throw new RuntimeException("삭제되지 않은 계정입니다.");
        }

        user.setDeletedAt(null);
        userRepository.save(user);
        log.info("계정 복구 완료 - email: {}", uEmail);

        return Map.of("message", "계정이 성공적으로 복구되었습니다.");
    }
}
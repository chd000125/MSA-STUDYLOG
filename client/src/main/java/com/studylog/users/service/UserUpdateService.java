package com.studylog.users.service;

import com.studylog.users.util.JwtToken;
import com.studylog.users.entity.User;
import com.studylog.users.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@Service
public class UserUpdateService {
    private final UserRepository userRepository;

    public UserUpdateService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    /**
     * 이름 변경 처리
     */
    @Transactional
    public Map<String, Object> updateUserName(String authHeader, Map<String, String> request, JwtToken jwtToken) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("인증 토큰이 필요합니다.");
        }

        String token = authHeader.substring(7);
        String uEmail = jwtToken.getuEmail(token);
        if (uEmail == null) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        String newName = request.get("uName");
        if (newName == null || newName.trim().isEmpty()) {
            throw new RuntimeException("사용자 이름은 비어 있을 수 없습니다.");
        }

        User user = userRepository.findByuEmail(uEmail)
                .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));

        if (user.getDeletedAt() != null) {
            throw new RuntimeException("삭제된 사용자는 수정할 수 없습니다.");
        }

        user.setuName(newName);
        User savedUser = userRepository.save(user);

        return Map.of(
                "message", "회원정보가 수정되었습니다.",
                "uEmail", savedUser.getuEmail(),
                "uName", savedUser.getuName()
        );
    }

    /**
     * 사용자 정보 조회 (프로필용)
     */
    public Map<String, String> getUserProfile(String authHeader, JwtToken jwtToken) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("인증 토큰이 필요합니다.");
        }
        String token = authHeader.substring(7);
        String uEmail = jwtToken.getuEmail(token);
        if (uEmail == null) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        User user = findByuEmail(uEmail);
        return Map.of(
                "uEmail", user.getuEmail(),
                "uName", user.getuName(),
                "uRole", user.getuRole() != null ? user.getuRole() : "USER",
                "deletedAt", user.getDeletedAt() != null ? user.getDeletedAt().toString() : ""
        );
    }

    public User findByuEmail(String email) {
        log.info("이메일로 사용자 조회 - 이메일: {}", email);
        return userRepository.findByuEmail(email)
                .orElseThrow(() -> {
                    log.error("사용자를 찾을 수 없음 - 이메일: {}", email);
                    return new RuntimeException("User not found with email: " + email);
                });
    }
}
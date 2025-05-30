package com.studylog.users.service;


import com.studylog.users.entity.User;
import com.studylog.users.repository.UserRepository;
import com.studylog.users.util.JwtToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 비밀번호 관리 서비스
 * - 비밀번호 검증
 * - 비밀번호 변경
 */
@Slf4j
@Service
public class PasswordService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtToken jwtToken;

    public PasswordService(PasswordEncoder passwordEncoder, UserRepository userRepository, JwtToken jwtToken) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.jwtToken = jwtToken;
    }


    @Transactional
    public void resetPassword(String uEmail, String newPassword) {
        log.info("이메일로 사용자 조회 - 이메일: {}", uEmail);
        User user = userRepository.findByuEmail(uEmail)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 새로운 비밀번호로 업데이트
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setuPassword(encodedPassword);
        userRepository.save(user);
    }

    public boolean checkPasswordWithToken(String rawPassword, String authHeader) {
        if (rawPassword == null || authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("비밀번호 또는 인증 토큰이 유효하지 않습니다.");
        }
        String token = authHeader.substring(7);
        String uEmail = jwtToken.getuEmail(token);
        User user = userRepository.findByuEmail(uEmail)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return passwordEncoder.matches(rawPassword, user.getuPassword());
    }

} 
package com.studylog.users.util;

import com.studylog.users.entity.User;
import com.studylog.users.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@Component
public class
AdminUserInitializer {
    private static final Logger log = LoggerFactory.getLogger(AdminUserInitializer.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    @Transactional
    public void initAdminUser() {
        try {
            log.info("서버 시작: 어드민 계정 초기화 시작");

            // 이미 어드민 계정이 있는지 확인
            Optional<User> existingAdmin = userRepository.findByuEmail("admin@study.com");
            if (existingAdmin.isPresent()) {
                log.info("어드민 계정이 이미 존재합니다.");
                return;
            }

            // 어드민 계정 생성
            User adminUser = new User();
            adminUser.setuName("관리자");
            adminUser.setuEmail("admin@study.com");
            adminUser.setuPassword(passwordEncoder.encode("admin1234")); // 초기 비밀번호
            adminUser.setuRole("ADMIN");

            userRepository.save(adminUser);
            log.info("어드민 계정 생성 완료 - email: admin@study.com");
        } catch (Exception e) {
            log.error("어드민 계정 초기화 중 오류 발생", e);
        }
    }
}
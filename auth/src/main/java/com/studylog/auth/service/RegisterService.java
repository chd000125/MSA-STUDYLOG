package com.studylog.auth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.studylog.auth.entity.User;
import com.studylog.auth.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class RegisterService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, String> redisTemplate;
    private final VerificationCodeSender verificationCodeSender;

    public RegisterService(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           RedisTemplate<String, String> redisTemplate,
                           VerificationCodeSender verificationCodeSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.redisTemplate = redisTemplate;
        this.verificationCodeSender = verificationCodeSender;
    }

    @Transactional
    public Map<String, String> registerUser(String email) {
        log.info("회원가입 요청 - email: {}", email);

        Optional<User> existingUser = userRepository.findByuEmail(email);
        if (existingUser.isPresent()) {
            log.error("이미 존재하는 이메일입니다: {}", email);
            return Map.of("error", "이미 존재하는 이메일입니다.", "status", "409");
        }

        try {
            String userJson = redisTemplate.opsForValue().get("register:temp:" + email);
            if (userJson == null) {
                log.error("Redis에 회원 정보가 없습니다: {}", email);
                return Map.of("error", "회원가입 정보가 만료되었거나 존재하지 않습니다.", "status", "410");
            }

            ObjectMapper objectMapper = new ObjectMapper();
            User user = objectMapper.readValue(userJson, User.class);

            user.setuRole("USER");
            user.setuPassword(passwordEncoder.encode(user.getuPassword()));
            userRepository.save(user);

            redisTemplate.delete("register:temp:" + email);
            redisTemplate.delete("authCode:" + email);

            log.info("회원가입 완료 - email: {}", email);
            return Map.of("message", "회원가입이 완료되었습니다. 로그인해주세요.", "status", "200");
        } catch (Exception e) {
            log.error("회원가입 처리 중 오류 발생", e);
            return Map.of("error", "회원가입 처리 중 오류가 발생했습니다: " + e.getMessage(), "status", "500");
        }
    }

    @Transactional
    public Map<String, String> requestRegister(User user) {
        log.info("회원가입 요청 (1단계) - email: {}", user.getuEmail());

        Optional<User> existingUser = userRepository.findByuEmail(user.getuEmail());
        if (existingUser.isPresent()) {
            return Map.of("error", "이미 존재하는 이메일입니다.", "status", "409");
        }

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String userJson = objectMapper.writeValueAsString(user);
            redisTemplate.opsForValue().set("register:temp:" + user.getuEmail(), userJson, Duration.ofMinutes(10));
        } catch (JsonProcessingException e) {
            return Map.of("error", "회원가입 정보를 처리할 수 없습니다.", "status", "500");
        }

        verificationCodeSender.sendVerificationCode(user.getuEmail());

        return Map.of("message", "인증 메일이 전송되었습니다. 이메일을 확인해주세요.", "status", "200");
    }
}
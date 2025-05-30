package com.studylog.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MailService implements VerificationCodeSender {

    private final JavaMailSender mailSender;
    private final RedisTemplate<String, String> redisTemplate;

    @Async
    @Override
    public void sendVerificationCode(String email) {
        String code = generateRandomCode();
        // 이메일로 전송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("이메일 인증 코드입니다.");
        message.setText("인증코드: " + code);
        mailSender.send(message);

        // Redis에 인증코드 저장 (5분 TTL)
        redisTemplate.opsForValue().set("authCode:" + email, code, Duration.ofMinutes(5));
    }

    public boolean verifyCode(String email, String code) {
        String storedCode = redisTemplate.opsForValue().get("authCode:" + email);
        return code.equals(storedCode);
    }

    private String generateRandomCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 6자리 숫자
        return String.valueOf(code);
    }
}
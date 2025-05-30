package com.studylog.auth.controller;

import com.studylog.auth.service.VerificationCodeSender;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/mail")
public class MailController {

    private final VerificationCodeSender mailService;

    public MailController(VerificationCodeSender mailService) {
        this.mailService = mailService;
    }

    @PostMapping("/send-verification")
    public ResponseEntity<Map<String, Object>> sendVerificationCode(@RequestParam String email) {
        mailService.sendVerificationCode(email);
        return ResponseEntity.ok(Map.of("message", "인증 코드가 이메일로 발송되었습니다."));
    }

    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, Object>> verifyCode(
            @RequestParam String email,
            @RequestParam String code) {
        boolean result = mailService.verifyCode(email, code);
        if (result) {
            return ResponseEntity.ok(Map.of("message", "이메일 인증 성공"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "인증 실패"));
        }
    }
}

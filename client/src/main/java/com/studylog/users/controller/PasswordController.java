package com.studylog.users.controller;

import com.studylog.users.service.PasswordService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users/password")
public class PasswordController {

    private final PasswordService passwordService;

    public PasswordController(PasswordService passwordService) {
        this.passwordService = passwordService;
    }

    /**
     * 비밀번호 확인 요청
     */
    @PostMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkPassword(
        @RequestBody Map<String, String> request,
        @RequestHeader("Authorization") String authHeader
    ) {
        boolean isValid = passwordService.checkPasswordWithToken(request.get("rawPassword"), authHeader);
        return ResponseEntity.ok(Map.of("verified", isValid));
    }

    /**
     * 비밀번호 재설정
     */
    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        String uEmail = request.get("uEmail");
        String newPassword = request.get("newPassword");

        passwordService.resetPassword(uEmail, newPassword);
        return ResponseEntity.ok(Map.of("message", "비밀번호가 성공적으로 변경되었습니다."));
    }
}

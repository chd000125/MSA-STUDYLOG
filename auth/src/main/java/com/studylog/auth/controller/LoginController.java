package com.studylog.auth.controller;

import com.studylog.auth.dto.LoginRequestDto;
import com.studylog.auth.service.LoginService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class LoginController {
    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequestDto request, HttpServletResponse response) {
        Map<String, Object> result = loginService.handleLogin(request, response);
        int status = (int) result.getOrDefault("status", HttpStatus.OK.value());
        return ResponseEntity.status(status).body(result);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {
        loginService.handleLogout(request, response);
        return ResponseEntity.ok(Map.of("message", "로그아웃이 완료되었습니다."));
    }
}
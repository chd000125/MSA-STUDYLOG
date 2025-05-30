package com.studylog.users.controller;

import com.studylog.users.service.UserUpdateService;
import com.studylog.users.util.JwtToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users/profile")
public class UserUpdateController {

    private final UserUpdateService userUpdateService;
    private final JwtToken jwtToken;
    private static final Logger log = LoggerFactory.getLogger(UserUpdateController.class);

    public UserUpdateController(UserUpdateService userUpdateService, JwtToken jwtToken) {
        this.userUpdateService = userUpdateService;
        this.jwtToken = jwtToken;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> getProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            Map<String, String> profile = userUpdateService.getUserProfile(authHeader, jwtToken);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            log.error("프로필 조회 중 오류 발생", e);
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("예상치 못한 오류 발생", e);
            return ResponseEntity.status(500).body(Map.of("error", "서버 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @PutMapping("/name")
    public ResponseEntity<Map<String, Object>> updateName(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> request) {
        try {
            Map<String, Object> response = userUpdateService.updateUserName(authHeader, request, jwtToken);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("이름 변경 중 오류 발생", e);
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("예상치 못한 오류 발생", e);
            return ResponseEntity.status(500).body(Map.of("error", "서버 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}
package com.studylog.users.controller;

import com.studylog.users.service.UserStateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/users/state")
public class UserStateController {

    private final UserStateService userStateService;

    public UserStateController(UserStateService userStateService) {
        this.userStateService = userStateService;
    }

    @PutMapping("/deactivate")
    public ResponseEntity<Map<String, String>> deactivateAccount(
            @RequestParam("uEmail") String uEmail,
            @RequestHeader("Authorization") String token) {
        try {
            Map<String, String> result = userStateService.deleteAccount(uEmail, token);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            log.error("계정 비활성화 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("서버 오류", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "서버 오류가 발생했습니다."));
        }
    }

    @PostMapping("/reactivate")
    public ResponseEntity<Map<String, String>> reactivateAccount(
            @RequestParam("uEmail") String uEmail) {
        try {
            Map<String, String> result = userStateService.restoreAccount(uEmail);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            log.error("계정 복구 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("서버 오류", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "서버 오류가 발생했습니다."));
        }
    }
}
package com.studylog.users.controller;

import com.studylog.users.entity.User;
import com.studylog.users.service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin/users")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getUsers(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(required = false) Long uId,
            @RequestParam(required = false) String uName,
            @RequestParam(required = false) String uEmail) {
        Map<String, Object> result = adminService.getUsers(page, size, uId, uName, uEmail);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{uId}")
    public ResponseEntity<?> getUserById(@PathVariable Long uId) {
        try {
            User user = adminService.getUserById(uId);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> userMap) {
        try {
            User created = adminService.createUser(userMap);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{uId}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long uId,
            @RequestBody Map<String, Object> updateMap) {
        try {
            User updated = adminService.updateUser(uId, updateMap);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{uId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long uId) {
        try {
            adminService.deleteUser(uId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
}
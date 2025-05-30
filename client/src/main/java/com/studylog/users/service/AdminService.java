package com.studylog.users.service;

import com.studylog.users.entity.User;
import com.studylog.users.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
public class AdminService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getUsers(int page, int size, Long uId, String uName, String uEmail) {
        Page<User> users = userRepository.searchUsers(
                uId,
                (uName == null || uName.isEmpty()) ? null : uName,
                (uEmail == null || uEmail.isEmpty()) ? null : uEmail,
                PageRequest.of(page, size)
        );

        Map<String, Object> response = new HashMap<>();
        response.put("users", users.getContent());
        response.put("totalPages", users.getTotalPages());
        response.put("totalElements", users.getTotalElements());
        response.put("currentPage", users.getNumber());

        return response;
    }

    @Transactional(readOnly = true)
    public User getUserById(Long uId) {
        return userRepository.findByuId(uId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    @Transactional
    public User createUser(Map<String, Object> userMap) {
        try {
            User user = new User();
            user.setuName((String) userMap.get("uName"));
            user.setuEmail((String) userMap.get("uEmail"));
            user.setuPassword(passwordEncoder.encode((String) userMap.get("uPassword")));
            user.setuRole((String) userMap.getOrDefault("uRole", "USER"));
            return userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("사용자 생성 중 오류가 발생했습니다.");
        }
    }

    @Transactional
    public User updateUser(Long uId, Map<String, Object> updateMap) {
        User user = userRepository.findByuId(uId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (updateMap.containsKey("uName")) user.setuName((String) updateMap.get("uName"));
        if (updateMap.containsKey("uRole")) user.setuRole((String) updateMap.get("uRole"));

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long uId) {
        User user = userRepository.findByuId(uId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        userRepository.delete(user);
    }
}
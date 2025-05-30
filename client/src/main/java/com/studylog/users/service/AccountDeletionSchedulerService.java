package com.studylog.users.service;

import com.studylog.users.entity.User;
import com.studylog.users.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class AccountDeletionSchedulerService {
    private final UserRepository userRepository;

    public AccountDeletionSchedulerService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Scheduled(cron = "0 0 0 * * ?") // 매일 자정에 실행
    @Transactional
    public void deleteExpiredAccounts() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(30);
        List<User> expiredUsers = userRepository.findByDeletedAtBefore(threshold);
        
        for (User user : expiredUsers) {
            userRepository.delete(user);
            log.info("만료된 계정 삭제 완료 - email: {}, deletedAt: {}", 
                user.getuEmail(), user.getDeletedAt());
        }
    }
} 
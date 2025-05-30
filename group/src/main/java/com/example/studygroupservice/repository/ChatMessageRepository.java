package com.example.studygroupservice.repository;

import com.example.studygroupservice.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByStudyGroupIdOrderByCreatedAt(Long groupId);
}

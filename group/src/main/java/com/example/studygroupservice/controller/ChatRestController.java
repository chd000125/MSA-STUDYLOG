package com.example.studygroupservice.controller;


import com.example.studygroupservice.entity.ChatMessage;
import com.example.studygroupservice.entity.StudyGroup;
import com.example.studygroupservice.repository.ChatMessageRepository;
import com.example.studygroupservice.repository.StudyGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/group/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final StudyGroupRepository studyGroupRepository;
    private final ChatMessageRepository chatMessageRepository;

    // ✅ 전체 StudyGroup 목록 조회 (선택사항)
    @GetMapping
    public List<StudyGroup> getAllGroups() {
        return studyGroupRepository.findAll();
    }

    // ✅ 단일 StudyGroup 조회
    @GetMapping("/{groupId}")
    public ResponseEntity<StudyGroup> getStudyGroup(@PathVariable Long groupId) {
        return studyGroupRepository.findById(groupId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StudyGroup> create(@RequestBody StudyGroup request) {
        request.setCreatedAt(LocalDateTime.now());
        if (request.getCurrentMember() == null) request.setCurrentMember(0);
        if (request.getStatus() == null) request.setStatus("모집중");

        StudyGroup saved = studyGroupRepository.save(request);
        return ResponseEntity.ok(saved);
    }

    // ✅ StudyGroup 기반 메시지 전체 조회
    @GetMapping("/{groupId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable Long groupId) {
        return studyGroupRepository.findById(groupId)
                .map(group -> ResponseEntity.ok(chatMessageRepository.findByStudyGroupIdOrderByCreatedAt(groupId)))
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ 메시지 직접 저장 (REST 방식)
    @PostMapping("/{groupId}/messages")
    public ResponseEntity<ChatMessage> sendMessage(
            @PathVariable Long groupId,
            @RequestBody ChatMessage request
    ) {
        return studyGroupRepository.findById(groupId).map(group -> {
            ChatMessage message = new ChatMessage();
            message.setUserEmail(request.getUserEmail());
            message.setUserName(request.getUserName());
            message.setContent(request.getContent());
            message.setCreatedAt(LocalDateTime.now());
            message.setStudyGroup(group);

            ChatMessage saved = chatMessageRepository.save(message);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ 단일 메시지 조회
    @GetMapping("/messages/{messageId}")
    public ResponseEntity<ChatMessage> getMessage(@PathVariable Long messageId) {
        return chatMessageRepository.findById(messageId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ 메시지 삭제
    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long messageId) {
        if (!chatMessageRepository.existsById(messageId)) {
            return ResponseEntity.notFound().build();
        }
        chatMessageRepository.deleteById(messageId);
        return ResponseEntity.noContent().build();
    }
}

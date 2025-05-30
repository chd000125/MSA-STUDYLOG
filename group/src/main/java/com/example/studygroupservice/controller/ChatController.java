package com.example.studygroupservice.controller;


import com.example.studygroupservice.dto.ChatMessageDTO;
import com.example.studygroupservice.entity.ChatMessage;
import com.example.studygroupservice.entity.StudyGroup;
import com.example.studygroupservice.repository.ChatMessageRepository;
import com.example.studygroupservice.repository.StudyGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final StudyGroupRepository studyGroupRepository;

    @MessageMapping("/chat/study-group/{groupId}")
    public void sendMessage(ChatMessageDTO dto) {
        StudyGroup group = studyGroupRepository.findById(dto.getGroupId())
                .orElseThrow(() -> new RuntimeException("스터디 그룹이 존재하지 않습니다."));

        ChatMessage message = ChatMessage.builder()
                .userEmail(dto.getUserEmail())
                .userName(dto.getUserName())
                .content(dto.getContent())
                .studyGroup(group)
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(message); // ✅ 저장 후 createdAt 가져옴

        dto.setCreatedAt(savedMessage.getCreatedAt()); // ✅ createdAt 설정

        chatMessageRepository.save(message);
        messagingTemplate.convertAndSend("/topic/chat/study-group/" + dto.getGroupId(), dto);
    }
}
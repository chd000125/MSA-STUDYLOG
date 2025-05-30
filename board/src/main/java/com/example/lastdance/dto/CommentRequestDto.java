package com.example.lastdance.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequestDto {
    private String authorEmail;  // ✅ 기존 authorId → authorEmail
    private String authorName;
    private String content;
}

package com.example.lastdance.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Builder
public class PostResponseDto {

    private Long id;
    private String title;
    private String content;

    private String authorEmail;
    private String authorName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long boardId;
    private String categoryName;   // ✅ 요거 추가!
    private Integer viewCount;
    private Integer commentCount;

    private Set<TagRequestDto> tags;

    public PostResponseDto(Long id, String title, String content,
                           String authorEmail, String authorName,
                           LocalDateTime createdAt, LocalDateTime updatedAt,
                           Long boardId, String categoryName,
                           Integer viewCount, Integer commentCount,
                           Set<TagRequestDto> tags) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.authorEmail = authorEmail;
        this.authorName = authorName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.boardId = boardId;
        this.categoryName = categoryName; // ✅ 이 라인 추가!
        this.viewCount = viewCount;
        this.commentCount = commentCount;
        this.tags = tags;
    }
}

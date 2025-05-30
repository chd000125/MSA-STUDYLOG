package com.example.studygroupservice.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class TodoResponseDto {

    private Long id;
    private String author;
    private String title;
    private boolean completed;
    private LocalDateTime createdDate;
    private double progress; // 작성률
    private Long studyGroupId;

    public TodoResponseDto(Long id, String author, String title, boolean completed, LocalDateTime createdDate, double progress, Long studyGroupId) {
        this.id = id;
        this.author = author;
        this.title = title;
        this.completed = completed;
        this.createdDate = createdDate;
        this.progress = progress;
        this.studyGroupId = studyGroupId;
    }
}

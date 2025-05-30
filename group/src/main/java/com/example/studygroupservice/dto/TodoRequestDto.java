package com.example.studygroupservice.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class TodoRequestDto {

    private String author; // 작성자
    private String title;  // 할 일 제목
    private boolean completed; // 완료 여부
    private Long studyGroupId;

    public TodoRequestDto(String author, String title, boolean completed, Long studyGroupId) {
        this.author = author;
        this.title = title;
        this.completed = completed;
        this.studyGroupId = studyGroupId;
    }
}

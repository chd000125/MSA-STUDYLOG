package com.example.lastdance.dto;

import com.example.lastdance.entity.Post;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PostRequestDto {

    private String title;
    private String content;

    private String authorEmail;  // ✅ 수정: authorId → authorEmail
    private String authorName;   // ✅ 수정: nickname → authorName

    private Long boardId; // ✅ 추가
    private List<String> tagNames;

    // PostRequestDto → Post 엔티티로 변환
    public Post toPost() {
        return Post.builder()
                .title(this.title)
                .content(this.content)
                .authorEmail(this.authorEmail)   // ✅ 변경
                .authorName(this.authorName)     // ✅ 변경
                .build();
    }
}

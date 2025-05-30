package com.example.studygroupservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private boolean completed;

    @Column(nullable = false)
    private LocalDateTime createdDate;

    @Transient
    private double progress;

    public Todo(String author, String title, boolean completed) {
        this.author = author;
        this.title = title;
        this.completed = completed;
        this.createdDate = LocalDateTime.now();
    }

    // ✅ StudyGroup과의 단방향 1:1 연관관계 추가
    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "study_group_id")
    private StudyGroup studyGroup;
}


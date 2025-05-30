package com.example.studygroupservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurriculumWeek {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int week;
    private String title;

    @ElementCollection
    private List<String> topics;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "study_group_id")
    private StudyGroup studyGroup;
}

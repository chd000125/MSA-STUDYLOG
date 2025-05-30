package com.example.studygroupservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "study_group_id")
    private StudyGroup studyGroup;

    private String category;
    private String location;

    private LocalDate startDate;
    private LocalDate endDate;

    private String uEmail;

    private String meetingType; // online, offline
    private String meetingTime; // "13:00" 등

    @ElementCollection
    private List<String> meetingDay;

    @ElementCollection
    private List<String> requirements;

    @ElementCollection
    private List<String> tools;

    @ElementCollection
    private List<String> tags;


}

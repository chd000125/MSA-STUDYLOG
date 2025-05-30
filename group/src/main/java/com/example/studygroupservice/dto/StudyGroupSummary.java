package com.example.studygroupservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyGroupSummary {
    private Long id;
    private String title;
    private String uName;
    private String uEmail;
    private String description;
    private String category;
    private String location;
    private int currentMember;
    private int maxMember;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> meetingDay;
    private String meetingTime;
    private String status;
}

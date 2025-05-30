package com.example.studygroupservice.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class StudyDetailUpdateRequest {
    private String category;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    private String meetingType;
    private String meetingTime;
    private List<String> meetingDay;
    private List<String> tools; // ✅ 추가!
    private String requesterEmail;
}

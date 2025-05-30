package com.example.studygroupservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data

public class StudyCreateRequest {


    // 기본 정보
    @JsonProperty
    private String title;
    @JsonProperty
    private String description;
    @JsonProperty
    private Integer maxMembers;
    @JsonProperty("uName")
    private String uName; // 작성자 ID
    @JsonProperty
    private String uEmail;

    // 상세 정보 (StudyDetail)
    @JsonProperty
    private String category;
    @JsonProperty
    private String location;
    @JsonProperty
    private LocalDate startDate;
    @JsonProperty
    private LocalDate endDate;
    @JsonProperty
    private String meetingType;
    @JsonProperty
    private String meetingTime;
    @JsonProperty
    private List<String> meetingDay;
    @JsonProperty
    private List<String> requirements;
    @JsonProperty
    private List<String> tools;
    @JsonProperty
    private List<String> benefits;
    @JsonProperty
    private List<String> tags;

    // 커리큘럼
    @JsonProperty
    private List<CurriculumDto> curriculum;

    @Data
    public static class CurriculumDto {
        @JsonProperty
        private int week;
        @JsonProperty
        private String title;
        @JsonProperty
        private List<String> topics;
    }
}

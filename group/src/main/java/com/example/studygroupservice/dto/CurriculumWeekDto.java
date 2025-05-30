package com.example.studygroupservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class CurriculumWeekDto {
    private Long id;
    private int week;
    private String title;
    private List<String> topics;
}
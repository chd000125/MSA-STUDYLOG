package com.example.studygroupservice.controller;

import com.example.studygroupservice.dto.CurriculumWeekDto;
import com.example.studygroupservice.entity.CurriculumWeek;
import com.example.studygroupservice.service.CurriculumService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/group/curriculums")
@RequiredArgsConstructor
public class CurriculumController {

    private final CurriculumService curriculumService;

    @GetMapping("/study/{studyId}")
    public ResponseEntity<Page<CurriculumWeek>> getCurriculumByStudy(
            @PathVariable Long studyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(curriculumService.getCurriculumByStudyId(studyId, pageable));
    }

    @PutMapping("/study/{studyId}")
    public ResponseEntity<?> updateCurriculums(
            @PathVariable Long studyId,
            @RequestBody List<CurriculumWeekDto> dtoList,
            @RequestParam String requesterEmail
    ) {
        curriculumService.replaceCurriculums(studyId, dtoList, requesterEmail);
        return ResponseEntity.ok("커리큘럼 수정 완료");
    }

}


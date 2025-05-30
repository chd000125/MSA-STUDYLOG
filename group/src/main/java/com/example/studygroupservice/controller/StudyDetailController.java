package com.example.studygroupservice.controller;

import com.example.studygroupservice.dto.StudyDetailUpdateRequest;
import com.example.studygroupservice.entity.StudyDetail;
import com.example.studygroupservice.service.StudyDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/group/study-details")
@RequiredArgsConstructor
public class StudyDetailController {

    private final StudyDetailService studyDetailService;

    @GetMapping("/{studyId}")
    public ResponseEntity<StudyDetail> getDetail(@PathVariable Long studyId) {
        return ResponseEntity.ok(studyDetailService.getDetailByStudyId(studyId));
    }

    @PutMapping("/{studyId}/tools")
    public ResponseEntity<?> updateTools(
            @PathVariable Long studyId,
            @RequestBody List<String> tools,
            @RequestParam String requesterEmail
    ) {
        studyDetailService.updateTools(studyId, tools, requesterEmail);
        return ResponseEntity.ok("도구 수정 완료");
    }

    @PutMapping("/{studyId}")
    public ResponseEntity<?> updateStudyDetail(
            @PathVariable Long studyId,
            @RequestBody StudyDetailUpdateRequest dto
    ) {
        studyDetailService.updateDetail(studyId, dto);
        return ResponseEntity.ok("스터디 상세 정보 수정 완료");
    }


}

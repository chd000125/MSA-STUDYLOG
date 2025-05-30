package com.example.studygroupservice.controller;

import com.example.studygroupservice.dto.StudyGroupSummary;
import com.example.studygroupservice.service.StudyGroupAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/group/admin/study-groups")
@RequiredArgsConstructor
public class StudyGroupAdminController {

    private final StudyGroupAdminService adminService;

    // ✅ 스터디 그룹 삭제 (관리자용)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudyGroup(@PathVariable Long id) {
        adminService.delete(id);
        return ResponseEntity.ok("스터디 그룹이 삭제되었습니다.");
    }

    // ✅ 스터디 그룹 목록 조회 (페이징, 관리자용)
    @GetMapping("/paged")
    public ResponseEntity<Page<StudyGroupSummary>> getAllPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<StudyGroupSummary> studyGroups = adminService.getAllStudyGroupsPaged(page, size);
        return ResponseEntity.ok(studyGroups);
    }
}

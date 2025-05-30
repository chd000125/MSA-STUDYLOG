package com.example.studygroupservice.controller;

import com.example.studygroupservice.entity.StudyMember;
import com.example.studygroupservice.service.StudyMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/group/study-members")
@RequiredArgsConstructor
public class StudyMemberController {

    private final StudyMemberService studyMemberService;

    // ✅ 1. 스터디 참가 신청 (C)
    @PostMapping
    public ResponseEntity<StudyMember> apply(
            @RequestParam Long studyId,
            @RequestParam String userEmail,
            @RequestParam String userName // ✅ 추가
    ) {
        return ResponseEntity.ok(studyMemberService.apply(studyId, userEmail, userName));
    }


    // ✅ 2. 특정 스터디의 신청자 페이징 조회 (R)
    @GetMapping("/by-study")
    public ResponseEntity<Page<StudyMember>> getByStudyPaged(
            @RequestParam Long studyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(studyMemberService.getByStudyPaged(studyId, page, size));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudyMember> updateStatus(
            @PathVariable Long id,
            @RequestBody StudyMember updated
    ) {
        return ResponseEntity.ok(studyMemberService.updateStatus(id, updated.getStatus()));
    }

    // ✅ 마스터가 특정 멤버를 강제 탈퇴
    @DeleteMapping("/{memberId}/kick")
    public ResponseEntity<?> kickMember(
            @PathVariable Long memberId,
            @RequestParam Long requesterId // 마스터 ID (검증용)
    ) {
        studyMemberService.kickMember(memberId, requesterId);
        return ResponseEntity.ok("강제 탈퇴 완료");
    }

    // ✅ 마스터가 신청자를 수락 처리
    @PutMapping("/{id}/accept")
    public ResponseEntity<?> accept(
            @PathVariable Long id,
            @RequestParam String requesterEmail
    ) {
        studyMemberService.acceptByEmail(id, requesterEmail);
        return ResponseEntity.ok("수락 완료");
    }


    // ✅ 마스터가 신청자를 거절 처리
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(
            @PathVariable Long id,
            @RequestParam String requesterEmail // 🔄 Long ❌ → String ⭕
    ) {
        studyMemberService.rejectByEmail(id, requesterEmail); // accept와 동일하게
        return ResponseEntity.ok("거절 완료");
    }


    // ✅ 유저가 스터디에서 자발적으로 탈퇴
    @DeleteMapping("/{memberId}/leave")
    public ResponseEntity<?> leaveGroup(
            @PathVariable Long memberId,
            @RequestParam String userEmail
    ) {
        studyMemberService.leave(memberId,userEmail);
        return ResponseEntity.ok("스터디 탈퇴 완료");
    }

    // ✅ 대기 상태인 신청자 목록 페이징 조회
    @GetMapping("/{studyId}/applicants")
    public ResponseEntity<Page<StudyMember>> getApplicantsPaged(
            @PathVariable Long studyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(studyMemberService.getApplicantsPaged(studyId, page, size));
    }


    @GetMapping("/{studyId}/accepted-members")
    public ResponseEntity<Page<StudyMember>> getAcceptedMembers(
            @PathVariable Long studyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(studyMemberService.getAcceptedMembers(studyId, page, size));
    }


}

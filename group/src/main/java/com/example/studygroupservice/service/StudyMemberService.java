package com.example.studygroupservice.service;

import com.example.studygroupservice.entity.StudyGroup;
import com.example.studygroupservice.entity.StudyMember;
import com.example.studygroupservice.repository.StudyGroupRepository;
import com.example.studygroupservice.repository.StudyMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudyMemberService {

    private final StudyMemberRepository studyMemberRepository;
    private final StudyGroupRepository studyGroupRepository;


    /**
     * ✅ 신청 기능 (Create)
     * - 기본 상태: "대기"
     */
    public StudyMember apply(Long studyId, String userEmail, String userName) {
        StudyGroup study = studyGroupRepository.findById(studyId)
                .orElseThrow(() -> new IllegalArgumentException("스터디 그룹이 없습니다: " + studyId));

        boolean alreadyApplied = studyMemberRepository.existsByStudyIdAndUserEmail(studyId, userEmail);

        if (alreadyApplied) {
            throw new IllegalArgumentException("이미 신청한 사용자입니다.");
        }

        StudyMember member = StudyMember.builder()
                .study(study)
                .userEmail(userEmail)
                .userName(userName)  // ✅ 여기!
                .status("대기")
                .build();

        return studyMemberRepository.save(member);
    }



    /**
     * ✅ 신청자 목록 페이징 조회 (거절 제외)
     */
    public Page<StudyMember> getByStudyPaged(Long studyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        return studyMemberRepository.findByStudyIdAndStatusNot(studyId, "거절", pageable);
    }

    /**
     * ✅ 대기 상태 신청자만 페이징 조회 (마스터 확인용)
     */
    public Page<StudyMember> getApplicantsPaged(Long studyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        return studyMemberRepository.findByStudyIdAndStatus(studyId, "대기", pageable);
    }

    /**
     * ✅ 상태 변경 (예: 수락 처리 등)
     */
    public StudyMember updateStatus(Long id, String newStatus) {
        StudyMember member = studyMemberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("신청자 정보를 찾을 수 없습니다. ID: " + id));

        // 이미 수락된 경우 다시 수락 불가
        if ("수락".equals(member.getStatus())) {
            throw new IllegalArgumentException("이미 수락된 신청자입니다.");
        }

        // 수락 처리일 때만 currentMember 증가 및 마감 검사
        if ("수락".equals(newStatus)) {
            StudyGroup group = member.getStudy();

            if (group.getCurrentMember() >= group.getMaxMember()) {
                throw new IllegalArgumentException("모집 인원이 이미 가득 찼습니다.");
            }

            group.setCurrentMember(group.getCurrentMember() + 1);

            if (group.getCurrentMember().equals(group.getMaxMember())) {
                group.setStatus("마감");
            }

            studyGroupRepository.save(group);
        }

        member.setStatus(newStatus);
        return studyMemberRepository.save(member);
    }

    /**
     * ✅ 마스터가 신청자를 수락 처리
     */
    public void acceptByEmail(Long memberId, String requesterEmail) {
        StudyMember member = studyMemberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("신청자를 찾을 수 없습니다. ID: " + memberId));

        StudyGroup group = member.getStudy();

        // ✅ 디버깅 로그 수정
        System.out.println("==== [스터디 마스터 수락 검증] ====");
        System.out.println("요청자 이메일: " + requesterEmail);
        System.out.println("스터디 마스터 이메일: " + group.getUEmail()); // 여기도 수정
        System.out.println("스터디 ID: " + group.getId());
        System.out.println("스터디 제목: " + group.getTitle());
        System.out.println("================================");

        if (!group.getUEmail().equals(requesterEmail)) { // ✅ 수정된 비교
            throw new IllegalArgumentException("스터디 마스터만 수락할 수 있습니다.");
        }

        if (!"대기".equals(member.getStatus())) {
            throw new IllegalArgumentException("대기 상태인 신청자만 수락할 수 있습니다.");
        }

        updateStatus(memberId, "수락");
    }



    /**
     * ✅ 마스터가 특정 멤버 강제 탈퇴
     */
    public void kickMember(Long memberId, Long requesterId) {
        StudyMember member = studyMemberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 멤버가 존재하지 않습니다."));

        StudyGroup group = member.getStudy();

        if (!group.getUName().equals(requesterId)) {
            throw new IllegalArgumentException("스터디 마스터만 탈퇴시킬 수 있습니다.");
        }

        studyMemberRepository.deleteById(memberId);
    }

    /**
     * ✅ 마스터가 신청자 거절 처리
     * - "대기" 상태인 경우만 가능
     */
    /**
     * ✅ 마스터가 신청자 거절 처리 (이메일 기반)
     */
    public void rejectByEmail(Long memberId, String requesterEmail) {
        StudyMember member = studyMemberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 신청자를 찾을 수 없습니다."));

        StudyGroup group = member.getStudy();

        // 🔍 마스터 인증
        if (!group.getUEmail().equals(requesterEmail)) {
            throw new IllegalArgumentException("스터디 마스터만 거절할 수 있습니다.");
        }

        if (!"대기".equals(member.getStatus())) {
            throw new IllegalArgumentException("대기 상태인 신청자만 거절할 수 있습니다.");
        }

        // ❗ 상태만 '거절'로 남기려면 아래처럼
        member.setStatus("거절");
        studyMemberRepository.save(member);

        // 또는 진짜 삭제하려면:
        // studyMemberRepository.deleteById(memberId);
    }


    /**
     * ✅ 유저가 스스로 나가기
     */
    public void leave(Long memberId, String userEmail) {
        StudyMember member = studyMemberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("신청 정보를 찾을 수 없습니다."));

        StudyGroup group = member.getStudy();

        if ("마스터".equals(member.getStatus())) {
            throw new IllegalArgumentException("마스터는 탈퇴할 수 없습니다.");
        }

        if (!member.getUserEmail().equals(userEmail)) {
            throw new IllegalArgumentException("본인만 탈퇴할 수 있습니다.");
        }

        if ("수락".equals(member.getStatus())) {
            int current = group.getCurrentMember();
            group.setCurrentMember(Math.max(0, current - 1));
            studyGroupRepository.save(group);
        }

        studyMemberRepository.deleteById(memberId);
    }


    public Page<StudyMember> getAcceptedMembers(Long studyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        return studyMemberRepository.findByStudyIdAndStatus(studyId, "수락", pageable);
    }

}

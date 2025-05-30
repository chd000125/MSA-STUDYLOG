package com.example.studygroupservice.repository;

import com.example.studygroupservice.entity.StudyMember;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyMemberRepository extends JpaRepository<StudyMember, Long> {

    // 📌 특정 스터디 ID에서 상태가 '거절'이 아닌 신청자 페이징 조회
    Page<StudyMember> findByStudyIdAndStatusNot(Long studyId, String status, Pageable pageable);

    // 📌 사용자 이메일 기준, '수락' 상태로 소속된 스터디 멤버 페이징 조회
    Page<StudyMember> findByUserEmailAndStatus(String userEmail, String status, Pageable pageable);

    Page<StudyMember> findByStudyIdAndStatus(Long studyId, String status, Pageable pageable);

    boolean existsByStudyIdAndUserEmail(Long studyId, String userEmail);

}

package com.example.studygroupservice.repository;

import com.example.studygroupservice.entity.StudyDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyDetailRepository extends JpaRepository<StudyDetail, Long> {

    StudyDetail findByStudyGroupId(Long studyGroupId);
}


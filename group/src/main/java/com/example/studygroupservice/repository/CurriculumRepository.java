package com.example.studygroupservice.repository;

import com.example.studygroupservice.entity.CurriculumWeek;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;

public interface CurriculumRepository extends JpaRepository<CurriculumWeek, Long> {
    Page<CurriculumWeek> findByStudyGroupId(Long studyId, Pageable pageable);

    @Modifying
    @Transactional
    void deleteByStudyGroupId(Long studyGroupId);
}
package com.example.studygroupservice.repository;

import com.example.studygroupservice.entity.StudyGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {

    Page<StudyGroup> findByuEmail(String uEmail, Pageable pageable);

}

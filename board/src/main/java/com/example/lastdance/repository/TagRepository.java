package com.example.lastdance.repository;

import com.example.lastdance.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name); // 태그 이름으로 조회
    List<Tag> findAllByNameIn(List<String> names);

}
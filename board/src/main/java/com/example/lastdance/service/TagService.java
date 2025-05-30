package com.example.lastdance.service;

import com.example.lastdance.entity.Post;
import com.example.lastdance.entity.Tag;
import com.example.lastdance.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;

    @Autowired
    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    // 태그 목록 조회
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    // 태그 생성
    @Transactional
    public Tag createTag(String name) {
        if (tagRepository.findByName(name).isPresent()) {
            throw new IllegalArgumentException("태그가 이미 존재합니다.");
        }
        Tag tag = Tag.builder()
                .name(name)
                .build();
        return tagRepository.save(tag);
    }

    // 태그 수정
    @Transactional
    public Tag updateTag(Long id, String name) {
        Tag tag = tagRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("태그가 존재하지 않습니다."));
        tag.setName(name);
        return tagRepository.save(tag);
    }

    // 태그 삭제
    @Transactional
    public void deleteTag(Long tagId) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new IllegalArgumentException("Tag not found"));

        // 모든 포스트에서 이 태그 제거
        for (Post post : tag.getPosts()) {
            post.getTags().remove(tag);
        }

        tagRepository.delete(tag);
    }

    // 태그 단건 조회
    public Tag getTagById(Long id) {
        return tagRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("태그가 존재하지 않습니다."));
    }
}
package com.example.lastdance.repository;

import com.example.lastdance.entity.PostDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface PostSearchRepository extends ElasticsearchRepository<PostDocument, String> {
    // Spring Data 방식은 사용하지 않음 (ElasticsearchClient 권장)
}
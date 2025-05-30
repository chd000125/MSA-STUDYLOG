package com.example.lastdance.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.example.lastdance.entity.PostDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PostAutoCompleteService {

    private final ElasticsearchClient elasticsearchClient;

    public List<Map<String, Object>> autocompleteTitle(String prefix) {
        try {
            SearchResponse<PostDocument> response = elasticsearchClient.search(s -> s
                            .index("posts_autocomplete")
                            .query(q -> q
                                    .match(m -> m
                                            .field("titleAutocomplete")
                                            .query(prefix)
                                    )
                            )
                            .size(10),
                    PostDocument.class
            );

            return response.hits().hits().stream()
                    .map(hit -> {
                        PostDocument doc = hit.source();
                        Map<String, Object> map = new HashMap<>();
                        map.put("pId", doc.getPId());
                        map.put("title", doc.getTitle());
                        return map;
                    })
                    .toList();

        } catch (IOException e) {
            throw new RuntimeException("자동완성 실패", e);
        }
    }
}

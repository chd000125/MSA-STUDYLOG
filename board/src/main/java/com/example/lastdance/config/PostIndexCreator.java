package com.example.lastdance.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class PostIndexCreator implements CommandLineRunner {

    private final ElasticsearchClient esClient;

    @Override
    public void run(String... args) {
        System.out.println("📌 [Elasticsearch] 인덱스 초기화 시작");

        try {
            createIndexIfNotExists("posts_autocomplete", "es/posts_autocomplete.settings.json");
        } catch (Exception e) {
            System.err.println("❌ [Elasticsearch] 인덱스 생성 실패: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("✅ [Elasticsearch] 인덱스 초기화 완료");
    }

    private void createIndexIfNotExists(String indexName, String classpathLocation) throws IOException {
        boolean exists = esClient.indices().exists(e -> e.index(indexName)).value();

        if (!exists) {
            InputStream inputStream = new ClassPathResource(classpathLocation).getInputStream();
            String json = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

            esClient.indices().create(c -> c
                    .index(indexName)
                    .withJson(new StringReader(json))
            );

            System.out.println("✅ [Elasticsearch] 인덱스 생성됨: " + indexName);
        } else {
            System.out.println("ℹ️ [Elasticsearch] 이미 존재하는 인덱스: " + indexName);
        }
    }
}

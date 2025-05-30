package com.example.lastdance.config;

import com.example.lastdance.service.IndexService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;


@Configuration
@RequiredArgsConstructor
public class PostDataIndexer {

    private final IndexService indexService;

    @EventListener(ApplicationReadyEvent.class)
    public void init() {
        indexService.indexAll();
        System.out.println("🔥 Elasticsearch 초기 색인 완료");
    }
}
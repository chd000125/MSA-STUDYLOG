package com.example.lastdance.service;

import com.example.lastdance.entity.Post;
import com.example.lastdance.entity.PostDocument;
import com.example.lastdance.repository.PostRepository;
import com.example.lastdance.repository.PostSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IndexService {

    private final PostRepository postRepository;
    private final PostSearchRepository postSearchRepository;

    public void indexAll() {
        List<Post> posts = postRepository.findAll().stream()
                .filter(post -> post.getPId() != null) // ✅ null 방지!
                .toList();

        posts.forEach(post -> System.out.println("✔ 색인 대상: " + post.getPId() + " / " + post.getTitle()));

        List<PostDocument> postDocs = posts.stream().map(post ->
                PostDocument.builder()
                        .id(post.getPId().toString())
                        .pId(post.getPId())
                        .title(post.getTitle())
                        .titleAutocomplete(post.getTitle())
                        .build()
        ).toList();

        postSearchRepository.saveAll(postDocs);
    }

}
//package com.example.lastdance.config;
//
//import com.example.lastdance.entity.Board;
//import com.example.lastdance.entity.Post;
//import com.example.lastdance.entity.Tag;
//import com.example.lastdance.repository.BoardRepository;
//import com.example.lastdance.repository.PostRepository;
//import com.example.lastdance.repository.TagRepository;
//import jakarta.annotation.PostConstruct;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import net.datafaker.Faker;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDateTime;
//import java.util.*;
//
//@Component
//@RequiredArgsConstructor
//public class DummyDataLoader {
//
//    private final PostRepository postRepository;
//    private final BoardRepository boardRepository;
//    private final TagRepository tagRepository;
//
//    private final Faker faker = new Faker(new Locale("ko"));
//
//    @PostConstruct
//    @Transactional
//    public void init() {
//        int count = 100;
//        int batchSize = 100;
//
//        List<Board> allBoards = boardRepository.findAll();
//        if (allBoards.isEmpty()) {
//            throw new IllegalStateException("게시판(Board) 데이터가 존재하지 않습니다.");
//        }
//
//        List<Tag> allTags = tagRepository.findAll();
//        if (allTags.isEmpty()) {
//            throw new IllegalStateException("태그(Tag) 데이터가 존재하지 않습니다.");
//        }
//
//        List<Post> batch = new ArrayList<>();
//
//        for (int i = 1; i <= count; i++) {
//            Board randomBoard = allBoards.get(faker.number().numberBetween(0, allBoards.size()));
//
//            Post post = Post.builder()
//                    .title(faker.lorem().sentence(3)) // ✅ 한글 제목 생성
//                    .content(faker.lorem().paragraph(5))
//                    .authorEmail(faker.internet().emailAddress())
//                    .authorName(faker.name().fullName())
//                    .createdAt(LocalDateTime.now())
//                    .updatedAt(LocalDateTime.now())
//                    .viewCount(faker.number().numberBetween(0, 100))
//                    .board(randomBoard)
//                    .tags(assignRandomTags(allTags))
//                    .build();
//
//            batch.add(post);
//
//            if (i % batchSize == 0) {
//                postRepository.saveAll(batch);
//                postRepository.flush();
//                batch.clear();
//                System.out.println(i + "건 배치 저장 완료");
//            }
//        }
//
//        if (!batch.isEmpty()) {
//            postRepository.saveAll(batch);
//            System.out.println("남은 데이터 " + batch.size() + "건 저장 완료");
//        }
//
//        System.out.println("총 " + count + "건의 게시글 생성 완료!");
//    }
//
//    private Set<Tag> assignRandomTags(List<Tag> allTags) {
//        int tagCount = faker.number().numberBetween(1, 4);
//        Collections.shuffle(allTags);
//        return new HashSet<>(allTags.subList(0, tagCount));
//    }
//}

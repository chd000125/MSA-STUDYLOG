//package com.example.lastdance.config;
//
//import com.example.lastdance.entity.Board;
//import com.example.lastdance.entity.Comment;
//import com.example.lastdance.entity.Post;
//import com.example.lastdance.entity.Tag;
//import com.example.lastdance.repository.BoardRepository;
//import com.example.lastdance.repository.CommentRepository;
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
//public class DummyCommentLoader {
//
//    private final PostRepository postRepository;
//    private final BoardRepository boardRepository;
//    private final TagRepository tagRepository;
//    private final CommentRepository commentRepository;
//
//    private final Faker faker = new Faker(new Locale("ko"));
//    private final Random random = new Random();
//
//    @PostConstruct
//    @Transactional
//    public void init() {
//        int count = 100;
//        int batchSize = 3000;
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
//        List<Post> postBatch = new ArrayList<>();
//
//        for (int i = 1; i <= count; i++) {
//            Board randomBoard = allBoards.get(faker.number().numberBetween(0, allBoards.size()));
//
//            Post post = Post.builder()
//                    .title(faker.lorem().sentence(3))
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
//            postBatch.add(post);
//
//            if (i % batchSize == 0) {
//                postRepository.saveAll(postBatch);
//                postRepository.flush();
//                postBatch.clear();
//                System.out.println(i + "건 배치 저장 완료");
//            }
//        }
//
//        if (!postBatch.isEmpty()) {
//            postRepository.saveAll(postBatch);
//            System.out.println("남은 데이터 " + postBatch.size() + "건 저장 완료");
//        }
//
//        System.out.println("총 " + count + "건의 게시글 생성 완료!");
//
//        // 댓글 생성
//        List<Post> posts = postRepository.findAll();
//        List<Comment> commentBatch = new ArrayList<>();
//        int totalCommentCount = 0;
//
//        String[] koreanComments = {
//                "좋은 글 감사합니다!",
//                "많이 배워갑니다.",
//                "질문이 있는데 답변 가능할까요?",
//                "이런 정보는 처음 알았어요.",
//                "도움이 많이 됐어요. 감사합니다!"
//        };
//
//        for (Post post : posts) {
//            int commentCount = random.nextInt(5) + 1;
//            for (int i = 0; i < commentCount; i++) {
//                String randomComment = koreanComments[random.nextInt(koreanComments.length)];
//
//                Comment comment = Comment.builder()
//                        .post(post)
//                        .authorEmail(faker.internet().emailAddress())
//                        .authorName(faker.name().fullName())
//                        .content(randomComment)
//                        .createdAt(LocalDateTime.now())
//                        .build();
//
//                commentBatch.add(comment);
//                totalCommentCount++;
//            }
//
//            if (commentBatch.size() >= 1000) {
//                commentRepository.saveAll(commentBatch);
//                commentBatch.clear();
//                System.out.println("댓글 1000개 저장 완료");
//            }
//        }
//
//        if (!commentBatch.isEmpty()) {
//            commentRepository.saveAll(commentBatch);
//            System.out.println("잔여 댓글 저장 완료");
//        }
//
//        System.out.println("총 생성된 댓글 수: " + totalCommentCount + "개");
//    }
//
//    private Set<Tag> assignRandomTags(List<Tag> allTags) {
//        int tagCount = faker.number().numberBetween(1, 4);
//        Collections.shuffle(allTags);
//        return new HashSet<>(allTags.subList(0, tagCount));
//    }
//}

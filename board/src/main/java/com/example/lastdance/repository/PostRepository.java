package com.example.lastdance.repository;

import com.example.lastdance.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

public interface PostRepository extends JpaRepository<Post, Long> {

    // 보드 ID로 게시글 조회
    @Query("SELECT p FROM Post p WHERE p.board.bId = :boardId ORDER BY p.createdAt DESC")
    Page<Post> findByBoardId(Long boardId, Pageable pageable);

    // 태그로만 게시글 조회
    @Query("SELECT p FROM Post p JOIN p.tags t WHERE t.name IN :tags ORDER BY p.createdAt DESC")
    Page<Post> findByTags(Set<String> tags, Pageable pageable);

    // 보드 ID와 태그로 게시글 조회
    @Query("SELECT p FROM Post p JOIN p.tags t WHERE p.board.bId = :boardId AND t.name IN :tags ORDER BY p.createdAt DESC")
    Page<Post> findByBoardIdAndTags(Long boardId, Set<String> tags, Pageable pageable);

    // 최신순 전체 게시글 조회
    @Query("SELECT p FROM Post p ORDER BY p.createdAt DESC")
    Page<Post> findAllLatest(Pageable pageable);

    // ✅ 작성자 이메일(authorEmail)로 게시글 조회 (수정)
    @Query("SELECT p FROM Post p WHERE p.authorEmail = :authorEmail ORDER BY p.createdAt DESC")
    Page<Post> findByAuthorEmail(String authorEmail, Pageable pageable);

    List<Post> findByTitle(String title);

}

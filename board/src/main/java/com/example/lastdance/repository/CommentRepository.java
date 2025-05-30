package com.example.lastdance.repository;

import com.example.lastdance.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * CommentRepository는 댓글(Comment) 엔티티에 대한 데이터 접근을 처리하는 JPA 리포지토리입니다.
 * JpaRepository를 상속하여 기본적인 CRUD 기능을 자동으로 제공합니다.
 */
public interface CommentRepository extends JpaRepository<Comment, Long> {

    /**
     * 특정 게시글(postId)에 해당하는 모든 댓글을 조회합니다.
     * JPA는 메서드 이름을 기반으로 쿼리를 자동 생성합니다.
     *
     * 'Post'는 Comment 엔티티 내부의 필드이며,
     * 'pId'는 Post 엔티티 내의 기본키 필드명과 정확히 일치해야 합니다.
     *
     * @param postId 조회할 게시글의 ID
     * @return 해당 게시글에 속한 댓글 리스트
     */
    List<Comment> findAllByPost_pId(Long postId);
}
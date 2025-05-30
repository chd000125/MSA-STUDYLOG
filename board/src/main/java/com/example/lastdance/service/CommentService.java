package com.example.lastdance.service;

import com.example.lastdance.dto.CommentRequestDto;
import com.example.lastdance.dto.CommentResponseDto;
import com.example.lastdance.entity.Comment;
import com.example.lastdance.entity.Post;
import com.example.lastdance.repository.CommentRepository;
import com.example.lastdance.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    // ✅ 댓글 생성
    public Comment create(CommentRequestDto dto, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        Comment comment = Comment.builder()
                .authorEmail(dto.getAuthorEmail())  // ✅ 변경된 필드명
                .authorName(dto.getAuthorName())    // ✅ 변경된 필드명
                .content(dto.getContent())
                .post(post)
                .build();

        return commentRepository.save(comment);
    }

    // ✅ 댓글 수정
    public Comment update(Long id, Comment updated) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        comment.setContent(updated.getContent());
        return commentRepository.save(comment);
    }

    // ✅ 댓글 삭제
    public void delete(Long id) {
        commentRepository.deleteById(id);
    }

    // ✅ 댓글 조회 (postId 기준)
    public List<CommentResponseDto> getByPostId(Long postId) {
        return commentRepository.findAllByPost_pId(postId).stream()
                .map(c -> CommentResponseDto.builder()
                        .postId(c.getPost().getPId())
                        .authorEmail(c.getAuthorEmail())  // ✅ 변경된 필드명
                        .authorName(c.getAuthorName())    // ✅ 변경된 필드명
                        .content(c.getContent())
                        .createdAt(c.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}

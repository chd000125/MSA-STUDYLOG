package com.example.lastdance.service;

import com.example.lastdance.dto.PostRequestDto;
import com.example.lastdance.dto.PostResponseDto;
import com.example.lastdance.dto.TagRequestDto;
import com.example.lastdance.entity.Board;
import com.example.lastdance.entity.Post;
import com.example.lastdance.entity.Tag;
import com.example.lastdance.repository.BoardRepository;
import com.example.lastdance.repository.PostRepository;
import com.example.lastdance.repository.TagRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final BoardRepository boardRepository;
    private final TagRepository tagRepository;

    public Post create(Post post, Long boardId, List<String> tagNames) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found"));
        post.setBoard(board);

        List<Tag> tags = tagRepository.findAllByNameIn(tagNames);
        post.setTags(new HashSet<>(tags));

        return postRepository.save(post);
    }

    @Transactional
    public Post update(Long id, PostRequestDto dto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        // 기본 정보 업데이트
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());

        // 💡 boardId로 Board 설정
        if (dto.getBoardId() != null) {
            Board board = boardRepository.findById(dto.getBoardId())
                    .orElseThrow(() -> new IllegalArgumentException("Board not found"));
            post.setBoard(board);
        }

        // 💡 tagNames로 Tag 세팅
        if (dto.getTagNames() != null) {
            List<Tag> tags = tagRepository.findAllByNameIn(dto.getTagNames());
            post.setTags(new HashSet<>(tags));
        }

        return postRepository.save(post);
    }


    public void delete(Long id) {
        postRepository.deleteById(id);
    }

    public List<PostResponseDto> getAllByBoard(Long boardId) {
        return postRepository.findAll().stream()
                .filter(post -> post.getBoard().getBId().equals(boardId))
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public PostResponseDto getById(Long id) {
        return postRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
    }

    public Page<PostResponseDto> getPostsByTags(Set<String> tags, Pageable pageable) {
        Page<Post> postPage;

        if (tags != null && !tags.isEmpty()) {
            postPage = postRepository.findByTags(tags, pageable);
        } else {
            postPage = postRepository.findAllLatest(pageable);
        }

        List<PostResponseDto> dtoList = postPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, postPage.getTotalElements());
    }

    public Page<PostResponseDto> getAllPaged(Pageable pageable) {
        return postRepository.findAll(pageable)
                .map(this::convertToDto);
    }

    public Page<PostResponseDto> getPostsByBoard(Long boardId, Set<String> tags, Pageable pageable) {
        if (tags == null || tags.isEmpty()) {
            return postRepository.findByBoardId(boardId, pageable).map(this::convertToDto);
        } else {
            return postRepository.findByBoardIdAndTags(boardId, tags, pageable).map(this::convertToDto);
        }
    }

    private PostResponseDto convertToDto(Post post) {
        int commentCount = post.getComments().size();

        return PostResponseDto.builder()
                .id(post.getPId())
                .title(post.getTitle())
                .content(post.getContent())
                .authorEmail(post.getAuthorEmail())
                .authorName(post.getAuthorName())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .viewCount(post.getViewCount())
                .boardId(post.getBoard().getBId())
                .categoryName(post.getBoard().getCategory())  // ✅ 추가된 라인!
                .commentCount(commentCount)
                .tags(convertTags(post.getTags()))
                .build();
    }


    private Set<TagRequestDto> convertTags(Set<Tag> tags) {
        return tags.stream()
                .map(tag -> TagRequestDto.builder()
                        .id(tag.getId())
                        .name(tag.getName())
                        .build())
                .collect(Collectors.toSet());
    }

    private PostResponseDto toDto(Post post) {
        return PostResponseDto.builder()
                .id(post.getPId())
                .title(post.getTitle())
                .content(post.getContent())
                .authorEmail(post.getAuthorEmail())
                .authorName(post.getAuthorName())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .viewCount(post.getViewCount())
                .boardId(post.getBoard().getBId())
                .categoryName(post.getBoard().getCategory()) // ✅ 여기가 빠졌었음!
                .commentCount(post.getComments().size())     // 🔁 있으면 좋음!
                .tags(convertTags(post.getTags()))
                .build();
    }


    @Transactional
    public PostResponseDto getByIdAndIncreaseView(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        post.setViewCount(post.getViewCount() + 1); // 조회수 증가
        return toDto(post);
    }

    public Page<PostResponseDto> getPostsByAuthor(String authorEmail, Pageable pageable) {
        return postRepository.findByAuthorEmail(authorEmail, pageable)  // ✅ 메서드 명도 수정 필요
                .map(this::convertToDto);
    }

    public List<PostResponseDto> getPostsByExactTitle(String title) {
        List<Post> posts = postRepository.findByTitle(title);  // 정확히 일치하는 제목
        return posts.stream()
                .map(this::convertToDto)
                .toList();
    }



}

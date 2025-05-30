package com.example.studygroupservice.service;

import com.example.studygroupservice.dto.TodoRequestDto;
import com.example.studygroupservice.dto.TodoResponseDto;
import com.example.studygroupservice.entity.StudyGroup;
import com.example.studygroupservice.entity.Todo;
import com.example.studygroupservice.repository.StudyGroupRepository;
import com.example.studygroupservice.repository.TodoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TodoService {

    private static final Logger logger = LoggerFactory.getLogger(TodoService.class);

    private final TodoRepository todoRepository;
    private final StudyGroupRepository studyGroupRepository;

    public TodoService(TodoRepository todoRepository, StudyGroupRepository studyGroupRepository) {
        this.todoRepository = todoRepository;
        this.studyGroupRepository = studyGroupRepository;
    }

    // ✅ 전체 Todo 리스트 조회
    public List<TodoResponseDto> getAllTodoList() {
        return todoRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // ✅ Todo 생성
    public TodoResponseDto createTodo(TodoRequestDto dto) {
        Todo todo = new Todo();
        todo.setAuthor(dto.getAuthor());
        todo.setTitle(dto.getTitle());
        todo.setCompleted(dto.isCompleted());
        todo.setCreatedDate(LocalDateTime.now());

        // ✅ StudyGroup 연관관계 설정
        if (dto.getStudyGroupId() != null) {
            StudyGroup group = studyGroupRepository.findById(dto.getStudyGroupId())
                    .orElseThrow(() -> new IllegalArgumentException("스터디 그룹이 존재하지 않습니다. id=" + dto.getStudyGroupId()));
            todo.setStudyGroup(group);
        }

        logger.debug("todolist 정보: {}", dto);

        Todo savedTodo = todoRepository.save(todo);
        return convertToDto(savedTodo);
    }

    // ✅ Todo 업데이트
    public TodoResponseDto updateTodo(Long id, TodoRequestDto dto) {
        return todoRepository.findById(id).map(todo -> {
            todo.setTitle(dto.getTitle());
            todo.setCompleted(dto.isCompleted());

            // ✅ StudyGroup도 업데이트할 수 있게 확장 (선택사항)
            if (dto.getStudyGroupId() != null) {
                StudyGroup group = studyGroupRepository.findById(dto.getStudyGroupId())
                        .orElseThrow(() -> new IllegalArgumentException("스터디 그룹이 존재하지 않습니다. id=" + dto.getStudyGroupId()));
                todo.setStudyGroup(group);
            }

            Todo updatedTodo = todoRepository.save(todo);
            return convertToDto(updatedTodo);
        }).orElseThrow(() -> new RuntimeException("해당 Todo가 없습니다."));
    }

    // ✅ Todo 삭제
    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }

    // ✅ 엔티티 -> DTO 변환 메서드
    private TodoResponseDto convertToDto(Todo todo) {
        double progress = todo.isCompleted() ? 100.0 : 0.0;

        Long studyGroupId = null;
        if (todo.getStudyGroup() != null) {
            studyGroupId = todo.getStudyGroup().getId();
        }

        return new TodoResponseDto(
                todo.getId(),
                todo.getAuthor(),
                todo.getTitle(),
                todo.isCompleted(),
                todo.getCreatedDate(),
                progress,
                studyGroupId
        );
    }
}

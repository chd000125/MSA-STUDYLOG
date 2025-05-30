package com.example.studygroupservice.controller;

import com.example.studygroupservice.dto.TodoRequestDto;
import com.example.studygroupservice.dto.TodoResponseDto;
import com.example.studygroupservice.service.TodoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/group/todos")
@Tag(name = "to-do-api", description = "Todolist에 관한 Rest Api")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService){
        this.todoService = todoService;
    }

    //조회
    @GetMapping
    @Operation(summary = "할일 리스트 조회", description = "Todolist 전부가져오가")
    public ResponseEntity<List<TodoResponseDto>> getAllTodos() {
        return ResponseEntity.ok(todoService.getAllTodoList());
    }

    //생성
    @PostMapping
    @Operation(summary = "할일 리스트 생성", description = "todoList 생성")
    public ResponseEntity<TodoResponseDto> createTodo(@RequestBody TodoRequestDto dto){
        return ResponseEntity.ok(todoService.createTodo(dto));
    }

    //수정
    @PutMapping("/{id}")
    @Operation(summary = "할일 리스트 수정 " ,description = "id에따라서 수정할수있도록")
    public ResponseEntity<TodoResponseDto> updateTodo(@PathVariable Long id,@RequestBody TodoRequestDto dto){
        return ResponseEntity.ok(todoService.updateTodo(id, dto));
    }

    //삭제
    @DeleteMapping("/{id}")
    @Operation(summary = "할일 리스트 삭제" ,description = "id에 따라서 삭제")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id){
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }

}

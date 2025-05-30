package com.example.studygroupservice.repository;


import com.example.studygroupservice.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {
}

package com.example.lastdance.controller;

import com.example.lastdance.service.PostAutoCompleteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/autocomplete")
@RequiredArgsConstructor
public class AutoCompleteController {

    private final PostAutoCompleteService postAutoCompleteService;

    @GetMapping("/title")
    public ResponseEntity<List<Map<String, Object>>> suggest(@RequestParam String prefix) {
        return ResponseEntity.ok(postAutoCompleteService.autocompleteTitle(prefix));
    }
}

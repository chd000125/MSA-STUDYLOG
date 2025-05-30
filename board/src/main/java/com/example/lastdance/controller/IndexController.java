package com.example.lastdance.controller;

import com.example.lastdance.service.IndexService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class IndexController {
    private final IndexService indexService;

    @GetMapping("api/index")
    public String indexData(){
        indexService.indexAll();
        return "완료!";
    }
}
package com.controller;

import com.Word.GetWordsRequest;
import com.Word.Word;
import com.service.WordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class WordController {

    @Autowired
    WordService wordService;


    @GetMapping("/words")
    public List<Word> GetWords(@RequestParam int start_index, @RequestParam int required_amount) {

        System.out.println("[info] Get Words Request");
        System.out.println("start_index: " + start_index);
        System.out.println("required_amount: " + required_amount);

        GetWordsRequest WordRequest = new GetWordsRequest();
        WordRequest.setStart_index(start_index);
        WordRequest.setRequired_amount(required_amount);

        return wordService.GetWords(WordRequest);
    }
}

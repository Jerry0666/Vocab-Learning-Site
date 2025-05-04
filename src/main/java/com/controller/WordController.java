package com.controller;

import com.Word.GetWordsRequest;
import com.Word.PostUserWordRequest;
import com.Word.Word;
import com.service.WordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class WordController {

    @Autowired
    WordService wordService;


    @GetMapping("/words")
    public List<Word> GetWords(@RequestParam int start_index, @RequestParam int required_amount, @CookieValue("sessionId") String sessionId) {

        System.out.println("[info] Get Words Request");
        System.out.println("start_index: " + start_index);
        System.out.println("required_amount: " + required_amount);
        System.out.println("sessionId: " + sessionId);

        GetWordsRequest WordRequest = new GetWordsRequest();
        WordRequest.setStart_index(start_index);
        WordRequest.setRequired_amount(required_amount);

        return wordService.GetWords(WordRequest, sessionId);
    }

    @GetMapping("/CustomizedWords")
    public List<Word> GetCustomizedWords(@CookieValue("sessionId") String sessionId) {
        System.out.println("[info] Get Customized Words Request");
        return null;
    }

    @PostMapping("/UserWord")
    public ResponseEntity<String> PostUserWord(@RequestBody PostUserWordRequest request, @CookieValue("sessionId") String sessionId) {
        System.out.println("[info] Post UserWord Request");
        int rt = wordService.AddUserWord(request.getWordId(),sessionId);
        if (rt == -1) {
            return new ResponseEntity<>("Unauthorized access", HttpStatus.UNAUTHORIZED);
        }
        if (rt == -2) {
            return new ResponseEntity<>("Resource already exists", HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>("Resource created successfully", HttpStatus.CREATED);
    }
}

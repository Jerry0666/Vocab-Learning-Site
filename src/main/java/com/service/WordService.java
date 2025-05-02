package com.service;

import com.Word.GetWordsRequest;
import com.Word.Word;
import com.dao.WordDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class WordService {

    @Autowired
    WordDao wordDao;

    @Autowired
    UserService userService;

    public List<Word> GetWords(GetWordsRequest WordsRequest, String sessionId) {
        if (!authentivateSession(sessionId)) {
            System.out.println("[error] can't find the session id.");
            return null;
        }
        List<Word> returnedWordList = wordDao.findWordsById(WordsRequest);
        return returnedWordList;

    }

    private void PrintWordList(List<Word> wordList) {
        for (Word word : wordList) {
            System.out.println("word:" + word.getWord());
            System.out.println("type:" + word.getType());
            System.out.println("def:" + word.getDef());
            System.out.println("example: " + word.getExample_sentence1());
            System.out.println("translate: " + word.getExample_translation1());
        }
    }

    private boolean authentivateSession(String sessionId) {
        if (userService.FindUserBySessionId(sessionId) == -1) {
            return false;
        } else {
            return true;
        }
    }
}

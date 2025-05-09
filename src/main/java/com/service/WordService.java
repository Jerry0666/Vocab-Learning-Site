package com.service;

import com.Word.GetWordsRequest;
import com.Word.Word;
import com.dao.WordDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Component
public class WordService {

    @Autowired
    WordDao wordDao;

    @Autowired
    UserService userService;

    public List<Word> GetWords(GetWordsRequest WordsRequest, String sessionId) {
        if (!authenticateSession(sessionId)) {
            System.out.println("[error] can't find the session id.");
            return null;
        }
        List<Word> returnedWordList = wordDao.findWordsById(WordsRequest);
        if (returnedWordList.isEmpty()) {
            System.out.println("[error] request data not found.");
            throw new NoSuchElementException("找不到要求的單字表");
        }

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

    private boolean authenticateSession(String sessionId) {
        Optional<Integer> userIdOpt = userService.FindUserBySessionId(sessionId);
        return userIdOpt.isPresent();
    }

    public void AddUserWord(int wordId, String sessionId) {
        Optional<Integer> userIdOpt = userService.FindUserBySessionId(sessionId);
        int userId;
        if (userIdOpt.isPresent()) {
            userId = userIdOpt.get();
        } else {
            throw new NoSuchElementException("No session found for the given session ID.");
        }
        System.out.println("userId:" + userId);
        System.out.println("wordId:" + wordId);
        wordDao.addUserWord(userId, wordId);
    }

    public List<Word> GetCustomizedWords(String sessionId) {
        Optional<Integer> userIdOpt = userService.FindUserBySessionId(sessionId);
        int userId;
        if (userIdOpt.isPresent()) {
            userId = userIdOpt.get();
        } else {
            throw new NoSuchElementException("No session found for the given session ID.");
        }
        System.out.println("userId:" + userId);

        List<Word> returnedWordList = wordDao.GetCustomizedWords(userId);
        if (returnedWordList.isEmpty()) {
            System.out.println("[error] 使用者請先新增單字到個人單字庫");
            throw new NoSuchElementException("使用者的單字庫沒有任何單字");
        }
        return returnedWordList;
    }

    public void DeleteUserWord(int wordId, String sessionId) {
        Optional<Integer> userIdOpt = userService.FindUserBySessionId(sessionId);
        int userId;
        if (userIdOpt.isPresent()) {
            userId = userIdOpt.get();
        } else {
            throw new NoSuchElementException("No session found for the given session ID.");
        }
        System.out.println("userId:" + userId);
        wordDao.deleteUserWord(userId, wordId);
    }
}

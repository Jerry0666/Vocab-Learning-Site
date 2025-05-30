package com.dao;

import com.Word.GetWordsRequest;
import com.Word.Word;
import com.Word.WordRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class WordDao {

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public List<Word> findWordsById(GetWordsRequest WordsRequest) {
        String sql = "select * from words where id >= :start_index && id < :end_index";
        Map<String, Object> map = new HashMap<>();
        map.put("start_index", WordsRequest.getStart_index());
        int end_index = WordsRequest.getStart_index() + WordsRequest.getRequired_amount();
        map.put("end_index",  end_index);
        System.out.println("[Dao] start_index:" + WordsRequest.getStart_index());
        System.out.println("[Dao] end_index:" + end_index);
        List<Word> list = null;
        list = namedParameterJdbcTemplate.query(sql,map,new WordRowMapper());
        return list;
    }

    public void addUserWord(int userId, int wordId) {
        String sql = "insert into user_words(user_id, word_id) values(:user_id, :word_id)";
        Map<String, Object> map = new HashMap<>();
        map.put("user_id", userId);
        map.put("word_id", wordId);
        namedParameterJdbcTemplate.update(sql, map);
    }

    public List<Word> GetCustomizedWords(int userId) {
        String sql = "SELECT w.* FROM user_words uw JOIN words w ON uw.word_id = w.id WHERE uw.user_id = :user_id";
        Map<String, Object> map = new HashMap<>();
        map.put("user_id", userId);
        return namedParameterJdbcTemplate.query(sql,map,new WordRowMapper());
    }

    public void deleteUserWord(int userId, int wordId) {
        String sql = "delete from user_words where user_id = :user_id and word_id = :word_id";
        Map<String, Object> map = new HashMap<>();
        map.put("user_id", userId);
        map.put("word_id", wordId);
        System.out.println("userId: " + userId);
        System.out.println("wordId: " + wordId);
        namedParameterJdbcTemplate.update(sql, map);
    }
}

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
        System.out.println("in the Dao");
        System.out.println("start_index:" + WordsRequest.getStart_index());
        System.out.println("end_index:" + end_index);
        List<Word> list = null;
        try {
            list = namedParameterJdbcTemplate.query(sql,map,new WordRowMapper());
        }
        catch (Exception e) {
            System.out.println("find words error");
            System.out.println(e.getMessage());
        }
        return list;
    }
}

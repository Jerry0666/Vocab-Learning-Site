package com.Word;

import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class WordRowMapper implements RowMapper<Word> {
    @Override
    public Word mapRow(ResultSet rs, int rowNum) throws SQLException {
        Word word = new Word();
        word.setWord(rs.getString("word"));
        word.setType(rs.getString("part_of_speech"));
        word.setDef(rs.getString("def"));
        word.setExample_sentence1(rs.getString("example_sentence1"));
        word.setExample_translation1(rs.getString("example_translation1"));
        return word;
    }
}

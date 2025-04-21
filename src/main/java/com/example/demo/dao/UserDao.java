package com.example.demo.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class UserDao {

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;


}

package com.dao;

import com.User.RegisterUserRequest;
import com.User.User;
import com.User.UserRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class UserDao {

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public boolean checkEmailExists(String email) {
        String sql = "SELECT COUNT(*) FROM user WHERE email = :email";
        Map<String, Object> map = Map.of("email", email);
        Integer count = namedParameterJdbcTemplate.queryForObject(sql, map, Integer.class);
        return count != null && count > 0;
    }

    public boolean checkUsernameExists(String username) {
        String sql = "SELECT COUNT(*) FROM user WHERE username = :username";
        Map<String, Object> map = Map.of("username", username);
        Integer count = namedParameterJdbcTemplate.queryForObject(sql, map, Integer.class);
        return count != null && count > 0;
    }

    public Integer createUser(User user) {
        String sql = "insert into user(email, username, password) values (:email, :username, :password)";
        Map<String, Object> map = new HashMap<>();
        map.put("email", user.getEmail());
        map.put("username", user.getUsername());
        map.put("password", user.getPassword());
        try {
            Integer returnValue = namedParameterJdbcTemplate.update(sql, map);
        } catch (Exception e) {
            System.out.println("Failed to write to database");
            System.out.println(e.getMessage());
            return -2;
        }
        return 0;
    }

    public User findUserByName(String name) {
        String sql = "select id, email, username, password from user where username = :username";
        Map<String, Object> map = Map.of("username", name);
        List<User> list = namedParameterJdbcTemplate.query(sql,map,new UserRowMapper());
        if (list != null && list.size() > 0) {
            return list.get(0);
        } else {
            return null;
        }
    }


}

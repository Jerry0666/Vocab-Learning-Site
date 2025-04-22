package com.service;

import com.User.RegisterUserRequest;
import com.User.User;
import com.User.UserDTO;
import com.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserService {
    @Autowired
    private UserDao userDao;

    public Integer createUser(RegisterUserRequest request) {
        // check user exist or not
        if (userDao.checkEmailExists(request.getEmail())) {
            System.out.println("User already exists");
            return -1;
        }

        User registerUser = request.toEntity();
        return userDao.createUser(registerUser);
    }
}

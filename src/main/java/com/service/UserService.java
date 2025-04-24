package com.service;

import com.User.LoginUserRequest;
import com.User.RegisterUserRequest;
import com.User.User;
import com.User.UserDTO;
import com.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Component
public class UserService {
    @Autowired
    private UserDao userDao;
    private static SecureRandom secureRandom = new SecureRandom();
    private static Base64.Encoder base64Encoder = Base64.getUrlEncoder().withoutPadding();
    private List<UserDTO> activeUsers = new ArrayList<UserDTO>();

    public Integer createUser(RegisterUserRequest request) {
        // check email exist or not
        if (userDao.checkEmailExists(request.getEmail())) {
            System.out.println("[info] User already exists");
            return -1;
        }

        // check username exist or not
        if (userDao.checkUsernameExists(request.getUsername())) {
            System.out.println("[info] Username already exists");
            return -1;
        }

        User registerUser = request.toEntity();
        return userDao.createUser(registerUser);
    }

    public Integer loginUser(LoginUserRequest request) {
        // check username or not
        if (!userDao.checkUsernameExists(request.getUsername())) {
            System.out.println("[info] Username not exists");
            return -1;
        }

        User user = userDao.findUserByName(request.getUsername());
        if (user.getPassword().equals(request.getPassword())) {
            System.out.println("[info] Login successful");

        } else {
            System.out.println("[info] Login failed");
            return -1;
        }

        // login success, create session id.
        String sessionId = generateSessionId(32);
        System.out.println("Generated Session ID (Base64): " + sessionId);
        System.out.println("Length: " + sessionId.length());
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(request.getUsername());
        userDTO.setSessionId(sessionId);
        activeUsers.add(userDTO);

        // return the session id


        return 0;
    }

    private static String generateSessionId(int length) {
        byte[] randomBytes = new byte[length];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }
}

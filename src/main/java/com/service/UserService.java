package com.service;

import com.User.LoginUserRequest;
import com.User.RegisterUserRequest;
import com.User.User;
import com.User.UserDTO;
import com.dao.UserDao;
import com.exception.DuplicateResourceException;
import com.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;


@Component
public class UserService {
    @Autowired
    private UserDao userDao;
    private static SecureRandom secureRandom = new SecureRandom();
    private static Base64.Encoder base64Encoder = Base64.getUrlEncoder().withoutPadding();
    private List<UserDTO> activeUsers = new ArrayList<UserDTO>();

    public void createUser(RegisterUserRequest request) {
        // check email exist or not
        if (userDao.checkEmailExists(request.getEmail())) {
            System.out.println("[info] User already exists. Throw exception.");
            throw new DuplicateResourceException("該email已被註冊");
        }

        // check username exist or not
        if (userDao.checkUsernameExists(request.getUsername())) {
            System.out.println("[info] Username already exists. Throw exception.");
            throw new DuplicateResourceException("該username已被註冊");
        }

        User registerUser = request.toEntity();
        userDao.createUser(registerUser);
    }

    public UserDTO loginUser(LoginUserRequest request) {
        // check username or not
        if (!userDao.checkUsernameExists(request.getUsername())) {
            System.out.println("[info] Username not exists.");
            throw new UserNotFoundException("該username不存在");
        }

        User user = userDao.findUserByName(request.getUsername());
        if (user.getPassword().equals(request.getPassword())) {
            System.out.println("[info] Login successful.");
        } else {
            System.out.println("[info] Login failed");
            throw new UserNotFoundException("密碼錯誤");
        }

        // login success, create session id.
        String sessionId = generateSessionId(32);
        System.out.println("Generated Session ID (Base64): " + sessionId);
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(request.getUsername());
        userDTO.setSessionId(sessionId);
        userDTO.setId(user.getId());
        activeUsers.add(userDTO);

        return userDTO;
    }

    private static String generateSessionId(int length) {
        byte[] randomBytes = new byte[length];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }

    public Optional<Integer> FindUserBySessionId(String sessionId) {
        return activeUsers.stream()
                .filter(user -> sessionId.equals(user.getSessionId()))
                .map(UserDTO::getId)
                .findFirst();
    }

    //test
    public void triggerDBerror(){
        userDao.triggerSqlError();
    }
}

package com.controller;

import com.User.LoginUserRequest;
import com.User.RegisterUserRequest;
import com.User.UserDTO;
import com.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterUserRequest request) {
        System.out.println("[info] register called");
        System.out.println("email: " + request.getEmail());
        System.out.println("username: " + request.getUsername());
        System.out.println("password: " + request.getPassword());

        userService.createUser(request);
        return new ResponseEntity<>("success", HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginUserRequest request, HttpServletResponse response) {
        System.out.println("[info] login called");
        System.out.println("username: " + request.getUsername());
        System.out.println("password: " + request.getPassword());
        UserDTO userDTO = userService.loginUser(request);

        System.out.println("[info][controller] login successful");
        // set session id cookie
        Cookie sessionIdCookie = new Cookie("sessionId", userDTO.getSessionId());
        // Set the path for which the cookie is valid (root in this case)
        sessionIdCookie.setPath("/");
        // Add the cookie to the HttpServletResponse
        response.addCookie(sessionIdCookie);
        return new ResponseEntity<>("redirect:/home", HttpStatus.SEE_OTHER);
    }

    //test
    @PostMapping("/test-db-error")
    public void testDbError() {
        userService.triggerDBerror();
    }
}

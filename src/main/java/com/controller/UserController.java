package com.controller;

import com.User.LoginUserRequest;
import com.User.RegisterUserRequest;
import com.User.UserDTO;
import com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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

        Integer returnValue = userService.createUser(request);

        if (returnValue >= 0){
            return new ResponseEntity<>("success", HttpStatus.CREATED);
        } else if (returnValue == -1){
            return new ResponseEntity<>("user already exists", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("fail", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginUserRequest request) {
        System.out.println("[info] login called");
        System.out.println("username: " + request.getUsername());
        System.out.println("password: " + request.getPassword());
        userService.loginUser(request);

        return new ResponseEntity<>("suc", HttpStatus.BAD_REQUEST);
    }
}

package com.example.demo.controller;

import com.example.demo.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SubmitController {

    @PostMapping("/register")
    public String RegisterHandler(@RequestBody User user){
        System.out.println("Receive register");
        System.out.println("User Fullname: " + user.getName());
        System.out.println("User Account: " + user.getAccount());
        System.out.println("User Password: " + user.getPassword());

        return "success";
    }
}

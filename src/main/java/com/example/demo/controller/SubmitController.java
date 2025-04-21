package com.example.demo.controller;

import com.example.demo.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SubmitController {

    @RequestMapping("/api")
    public String SubmitHandler(@RequestBody User user) {
        System.out.println("Receive submit");
        System.out.println("user: " + user.getName());
        return "great";
    }

    @PostMapping("/register")
    public String RegisterHandler(@RequestBody User user){
        System.out.println("Receive register");
        System.out.println("User name: " + user.getName());
        System.out.println("User Account: " + user.getAccount());
        System.out.println("User Pass: " + user.getPassword());

        return "success";
    }
}

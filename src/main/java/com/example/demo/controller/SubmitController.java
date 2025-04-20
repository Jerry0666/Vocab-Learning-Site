package com.example.demo.controller;

import com.example.demo.User;
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
}

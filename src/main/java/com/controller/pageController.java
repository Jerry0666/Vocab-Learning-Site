package com.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class pageController {
    @RequestMapping("/login")
    public String greeting() {
        return "login";
    }

    @RequestMapping("/home")
    public String home() {
        // check session id;


        return "home";
    }
}

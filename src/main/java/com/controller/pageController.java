package com.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class pageController {
    @RequestMapping("/index")
    public String greeting() {
        return "index";
    }

    @RequestMapping("/home")
    public String home() {
        // check session id;


        return "home";
    }
}

package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdditionController {

    @GetMapping("/add")
    public String addNumbers(@RequestParam int num1, @RequestParam int num2) {
        int result = num1 + num2;
        return "The sum is: " + result;
    }
}

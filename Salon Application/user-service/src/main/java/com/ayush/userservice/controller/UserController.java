package com.ayush.userservice.controller;

import com.ayush.userservice.model.User;
import com.ayush.userservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<User> createUser(@RequestBody @Valid User user) {
        User result = userService.createUser(user);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody @Valid User user) {
        User result = userService.updateUser(id, user);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        String result = userService.deleteUser(id);

        Map<String, String> map = new HashMap<>();
        map.put("message", result);
        return new ResponseEntity<>(map, HttpStatus.OK);
    }


    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) {
        // jwt comes as "Bearer eyJ..." strip it here or in service
        if (jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);
        }
        User user = userService.getUserByJwt(jwt);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}

package com.ayush.userservice.service;


import com.ayush.userservice.model.User;

import java.util.List;

public interface UserService {
    User createUser(User user);

    List<User> getAllUsers();

    User updateUser(Long id, User user);

    String deleteUser(Long id);

    User getUserById(Long id);
}

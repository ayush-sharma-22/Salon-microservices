package com.ayush.userservice.service;

import com.ayush.userservice.UserRepository;
import com.ayush.userservice.exceptions.ResourceNotFound;
import com.ayush.userservice.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id).
                orElseThrow(()-> new ResourceNotFound("User","userId",id));

        existingUser.setFullName(user.getFullName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPassword(user.getPassword());
        existingUser.setPhone(user.getPhone());
        existingUser.setRole(user.getRole());

        return userRepository.save(existingUser);
    }

    @Override
    public String deleteUser(Long id) {
        User existingUser = userRepository.findById(id).
                orElseThrow(()-> new ResourceNotFound("User","userId",id));

        userRepository.deleteById(existingUser.getId());
        return "User deleted Successfully!";
    }

    @Override
    public User getUserById(Long id) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(()->new ResourceNotFound("User", "UserId",id));

        return existingUser;
    }
}

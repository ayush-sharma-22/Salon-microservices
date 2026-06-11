package com.ayush.userservice.service;

import com.ayush.userservice.payload.dto.KeycloakUserDTO;
import com.ayush.userservice.repository.UserRepository;
import com.ayush.userservice.exceptions.ResourceNotFound;
import com.ayush.userservice.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final KeycloakService keycloakService;


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

    @Override
    public User getUserByJwt(String jwt) {
        KeycloakUserDTO keycloakUserDTO = keycloakService.fetchUserProfileByJwt(jwt);
        if (keycloakUserDTO == null || keycloakUserDTO.getEmail() == null) {
            return null;
        }
        List<User> users = userRepository.findByEmail(keycloakUserDTO.getEmail());
        User user = users.isEmpty() ? null : users.get(0);
        if (user == null) {
            user = new User();
            user.setEmail(keycloakUserDTO.getEmail());
            user.setUsername(keycloakUserDTO.getUsername() != null ? keycloakUserDTO.getUsername() : keycloakUserDTO.getEmail());
            user.setFullName((keycloakUserDTO.getFirstName() != null ? keycloakUserDTO.getFirstName() : "") + " " + (keycloakUserDTO.getLastName() != null ? keycloakUserDTO.getLastName() : ""));
            user.setRole(com.ayush.userservice.enums.UserRole.CUSTOMER);
            user.setCreatedAt(java.time.LocalDateTime.now());
            user = userRepository.save(user);
        }
        return user;
    }
}

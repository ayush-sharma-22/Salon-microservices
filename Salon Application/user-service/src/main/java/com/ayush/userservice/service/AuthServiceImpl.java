package com.ayush.userservice.service;

import com.ayush.userservice.repository.UserRepository;
import com.ayush.userservice.model.User;
import com.ayush.userservice.payload.dto.SignupDTO;
import com.ayush.userservice.payload.response.AuthResponse;
import com.ayush.userservice.payload.response.TokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements  AuthService {

    private final KeycloakService keycloakService;
    private final UserRepository userRepository;

    @Override
    public AuthResponse login(String username, String password) {
        TokenResponse tokenResponse = keycloakService.getAdminAccessToken(
                username,
                password,
                "password",
                null
        );

        AuthResponse authResponse = new AuthResponse();
        authResponse.setRefressToken(tokenResponse.getRefreshToken());
        authResponse.setJwtToken(tokenResponse.getAccessToken());
        authResponse.setMessage("Login successfully");
        return authResponse;
    }

    @Override
    public AuthResponse signup(SignupDTO signupDTO)throws Exception {
        keycloakService.createUsers(signupDTO);
        List<User> existingUsers = userRepository.findByEmail(signupDTO.getEmail());
        User existingUser = existingUsers.isEmpty() ? null : existingUsers.get(0);
        if (existingUser == null) {
            User user = new User();
            user.setEmail(signupDTO.getEmail());
            user.setUsername(signupDTO.getUsername());
            user.setPassword(signupDTO.getPassword());
            user.setRole(signupDTO.getRole());
            user.setFullName(signupDTO.getFirstName() + " " + signupDTO.getLastName());
            user.setCreatedAt(LocalDateTime.now());
            userRepository.save(user);
        } else {
            if (signupDTO.getPassword() != null) {
                existingUser.setPassword(signupDTO.getPassword());
                userRepository.save(existingUser);
            }
        }

        TokenResponse tokenResponse = keycloakService.getAdminAccessToken(
                signupDTO.getUsername(),
                signupDTO.getPassword(),
                "password",
                null
        );

        AuthResponse authResponse = new AuthResponse();
        authResponse.setRefressToken(tokenResponse.getRefreshToken());
        authResponse.setJwtToken(tokenResponse.getAccessToken());
        authResponse.setRole(signupDTO.getRole());
        authResponse.setMessage("User registered successfully");

        return authResponse;
    }

    @Override
    public AuthResponse getAccessTokenFromRefreshToken(String refreshToken) {
        TokenResponse tokenResponse = keycloakService.getAdminAccessToken(
                null,
                null,
                "refresh_token",
                refreshToken
        );

        AuthResponse authResponse = new AuthResponse();
        authResponse.setRefressToken(tokenResponse.getAccessToken());
        authResponse.setJwtToken(tokenResponse.getAccessToken());
        authResponse.setMessage("Token Received successfully");
        return authResponse;
    }
}

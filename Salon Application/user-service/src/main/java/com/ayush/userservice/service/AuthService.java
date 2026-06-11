package com.ayush.userservice.service;

import com.ayush.userservice.payload.dto.SignupDTO;
import com.ayush.userservice.payload.response.AuthResponse;

public interface AuthService {

    public AuthResponse login(String username, String password);

    public AuthResponse signup(SignupDTO signupDTO) throws Exception;

    public AuthResponse getAccessTokenFromRefreshToken(String refreshToken);
}

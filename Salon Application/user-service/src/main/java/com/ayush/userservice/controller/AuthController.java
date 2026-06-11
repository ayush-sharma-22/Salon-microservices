package com.ayush.userservice.controller;

import com.ayush.userservice.payload.dto.LoginDTO;
import com.ayush.userservice.payload.dto.SignupDTO;
import com.ayush.userservice.payload.response.AuthResponse;
import com.ayush.userservice.service.AuthService;
import jakarta.ws.rs.GET;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginDTO request
    ) {
        AuthResponse response = authService.login(
                request.getUsername(),
                request.getPassword()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @RequestBody SignupDTO signupDTO
    ) throws Exception {

        AuthResponse response = authService.signup(signupDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/access-token/refress-token/{refreshToken}")
    public ResponseEntity<AuthResponse> refreshToken(
            @PathVariable String refreshToken
    ) {

        AuthResponse response =
                authService.getAccessTokenFromRefreshToken(
                        refreshToken
                );

        return ResponseEntity.ok(response);
    }

}

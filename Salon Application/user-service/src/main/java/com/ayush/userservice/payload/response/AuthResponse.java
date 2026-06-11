package com.ayush.userservice.payload.response;

import com.ayush.userservice.enums.UserRole;
import lombok.Data;

@Data
public class AuthResponse {
    private String jwtToken;
    private String refressToken;
    private String message;
    private String title;
    private UserRole role;
}

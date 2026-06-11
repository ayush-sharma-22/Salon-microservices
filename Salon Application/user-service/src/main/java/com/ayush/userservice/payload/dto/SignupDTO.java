package com.ayush.userservice.payload.dto;

import com.ayush.userservice.enums.UserRole;
import lombok.Data;

@Data
public class SignupDTO {
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private UserRole role;
}

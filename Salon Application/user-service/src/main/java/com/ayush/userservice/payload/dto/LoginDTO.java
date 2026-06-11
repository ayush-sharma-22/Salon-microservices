package com.ayush.userservice.payload.dto;

import lombok.Data;

@Data
public class LoginDTO {
    private String username;
    private String password;
}

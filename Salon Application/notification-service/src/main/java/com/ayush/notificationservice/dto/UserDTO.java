package com.ayush.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Long id;

    private String fullName;

    private String username;


    private String email;

    private String password;

    private String phone;

    private String role;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

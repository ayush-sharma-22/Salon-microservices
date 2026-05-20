package com.ayush.userservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @NotBlank(message = "username is mandatory")
    private String username;

    @NotBlank(message = " Email is mandatory")
    @Email(message = "Email is invalid")
    private String email;

    @NotBlank(message = " password is mandatory")
    private String password;

    private String phone;

    @NotBlank(message = "role is mandatory")
    private String role;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

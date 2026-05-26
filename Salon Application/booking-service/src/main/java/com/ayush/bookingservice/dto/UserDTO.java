package com.ayush.bookingservice.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

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

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

package com.ayush.userservice.payload.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UserRequest {
    private  String username;
    private boolean enabled;
    private String firstName;
    private String lastName;
    private String email;
    private List<Credentials> credentials = new ArrayList<>();
}

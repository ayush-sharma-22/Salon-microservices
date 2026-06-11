package com.ayush.userservice.payload.dto;

import lombok.Data;

@Data
public class Credentials {
    private String type;
    private String value;
    private boolean temporary;
}

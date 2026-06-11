package com.ayush.userservice.payload.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Data
public class KeycloakRole {
    String id;
    String name;
    String description;
    boolean composite;
    boolean clientRole;
    String containerId;
    Map<String, Object> attributes;

}

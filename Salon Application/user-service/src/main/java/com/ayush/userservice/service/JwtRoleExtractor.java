package com.ayush.userservice.service;

import com.ayush.userservice.enums.UserRole;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class JwtRoleExtractor {

    public static UserRole getRoleFromJwt(String jwt) {
        if (jwt == null) return UserRole.CUSTOMER;
        if (jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);
        }
        try {
            String[] parts = jwt.split("\\.");
            if (parts.length < 2) return UserRole.CUSTOMER;
            byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
            String payload = new String(decoded, StandardCharsets.UTF_8);
            
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(payload);
            JsonNode resourceAccess = rootNode.path("resource_access");
            JsonNode clientNode = resourceAccess.path("salon-booking-client");
            JsonNode rolesNode = clientNode.path("roles");
            if (rolesNode.isArray()) {
                for (JsonNode roleNode : rolesNode) {
                    String roleName = roleNode.asText();
                    if ("OWNER".equalsIgnoreCase(roleName)) {
                        return UserRole.OWNER;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return UserRole.CUSTOMER;
    }
}

package com.ayush.userservice.payload.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class KeycloakUserDTO {

    @JsonProperty("id")
    @JsonAlias("sub")
    private String id;

    @JsonProperty("firstName")
    @JsonAlias("given_name")
    private String firstName;

    @JsonProperty("lastName")
    @JsonAlias("family_name")
    private String lastName;

    @JsonProperty("email")
    private String email;

    @JsonProperty("username")
    @JsonAlias("preferred_username")
    private String username;
}
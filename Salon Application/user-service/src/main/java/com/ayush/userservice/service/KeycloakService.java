package com.ayush.userservice.service;

import com.ayush.userservice.payload.dto.*;
import com.ayush.userservice.payload.response.TokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KeycloakService {

    @Value("${keycloak.url:http://localhost:9090}")
    private String keycloakUrl;

    private String getKeycloakAdminApi() {
        return keycloakUrl + "/admin/realms/master/users";
    }

    private String getTokenUrl() {
        return keycloakUrl + "/realms/master/protocol/openid-connect/token";
    }

    private static final String CLIENT_ID ="salon-booking-client";
    private static final String CLIENT_SECRET ="DU2aGvZfqRwfUuBObMnsNFrLS2BJWtru";
    private static final String GRANT_TYPE ="password";
    private static final String scope ="openid profile email";
    private static final String username ="ayush";
    private static final String password ="12345678";
    private  static final String client_id ="0ebea1a1-499c-4280-953c-4cd2849fb239";

    private final RestTemplate restTemplate;

    public void createUsers(SignupDTO signupDTO) throws Exception {

        String accessToken = getAdminAccessToken(
                username,
                password,
                GRANT_TYPE,
                null
        ).getAccessToken();

        Credentials credentials = new Credentials();
        credentials.setType("password");
        credentials.setValue(signupDTO.getPassword());
        credentials.setTemporary(false);

        List<Credentials> credentialsList = new ArrayList<>();
        credentialsList.add(credentials);

        UserRequest userRequest = new UserRequest();
        userRequest.setUsername(signupDTO.getUsername());
        userRequest.setFirstName(signupDTO.getFirstName());
        userRequest.setLastName(signupDTO.getLastName());
        userRequest.setEmail(signupDTO.getEmail());
        userRequest.setEnabled(true);
        userRequest.setCredentials(credentialsList);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        HttpEntity<UserRequest> request =
                new HttpEntity<>(userRequest, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                getKeycloakAdminApi(),
                request,
                String.class
        );

        if (response.getStatusCode() == HttpStatus.CREATED) {

            System.out.println("User created successfully");

            KeycloakUserDTO user =
                    fetchFirstUserByUsername(
                            signupDTO.getUsername(),
                            accessToken
                    );

            KeycloakRole role =
                    getRoleByName(
                            client_id,
                            accessToken,
                            signupDTO.getRole().name()
                    );

            assignRoleToUser(
                    user.getId(),
                    client_id,
                    List.of(role),
                    accessToken
            );

        } else {
            throw new RuntimeException("Failed to create user");
        }
    }

    public TokenResponse getAdminAccessToken(String username, String password,
                                             String grandType, String refreshToken){

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();

        body.add("client_id", CLIENT_ID);
        body.add("client_secret", CLIENT_SECRET);
        body.add("grant_type", grandType);

        if ("password".equals(grandType)) {
            body.add("username", username);
            body.add("password", password);
        }

        if ("refresh_token".equals(grandType)) {
            body.add("refresh_token", refreshToken);
        }

        body.add("scope", scope);

        HttpEntity<MultiValueMap<String, String>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<TokenResponse> response =
                restTemplate.postForEntity(
                        getTokenUrl(),
                        request,
                        TokenResponse.class
                );

        return response.getBody();
    }

    public KeycloakRole getRoleByName(String clientId, String token, String role){
        String url = keycloakUrl + "/admin/realms/master/clients/" + clientId + "/roles/" + role;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<KeycloakRole> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                request,
                KeycloakRole.class
        );

        return response.getBody();
    }

    public KeycloakUserDTO fetchFirstUserByUsername(String username, String token){
        String url = keycloakUrl + "/admin/realms/master/users?username=" + username + "&exact=true";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<String> request = new HttpEntity<>(headers);

        ResponseEntity<KeycloakUserDTO[]    > response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                request,
                KeycloakUserDTO[].class
        );

        KeycloakUserDTO[] users = response.getBody();
        if (users != null && users.length > 0) {
            return users[0];
        }

        throw new RuntimeException("User not found: " + username);
    }

    public void assignRoleToUser(String userId, String clientId, List<KeycloakRole> roles, String token){
        String url = keycloakUrl + "/admin/realms/master/users/" + userId + "/role-mappings/clients/" + clientId;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        HttpEntity<List<KeycloakRole>> request = new HttpEntity<>(roles, headers);

        restTemplate.postForEntity(
                url,
                request,
                String.class
        );

        System.out.println("Role assigned successfully to user: " + userId);
    }

    public KeycloakUserDTO fetchUserProfileByJwt(String jwt){
        String url = keycloakUrl + "/realms/master/protocol/openid-connect/userinfo";

        if (jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(jwt);

        HttpEntity<List<KeycloakRole>> request = new HttpEntity<>(headers);

        ResponseEntity<KeycloakUserDTO> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                request,
                KeycloakUserDTO.class
        );
        return response.getBody();
    }

}

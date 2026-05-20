package com.ayush.userservice.exceptions;

public class APIException extends RuntimeException{

    public APIException(String message) {
        super(message);
    }

    public APIException() {
    }
}
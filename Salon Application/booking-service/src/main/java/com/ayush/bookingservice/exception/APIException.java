package com.ayush.bookingservice.exception;

public class APIException extends RuntimeException{
    public APIException(String message){
        super(message);
    }
}

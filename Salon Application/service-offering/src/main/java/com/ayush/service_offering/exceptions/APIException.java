package com.ayush.service_offering.exceptions;

public class APIException extends RuntimeException{
    public APIException(String message){
        super(message);
    }
}

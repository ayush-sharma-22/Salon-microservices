package com.ayush.userservice.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    ErrorMessage errorMessage =  new ErrorMessage();

    @ExceptionHandler(ResourceNotFound.class)
    public ResponseEntity<ErrorMessage> handleResourceNotFound(ResourceNotFound exception){
        errorMessage.setMessage(exception.getMessage());
        return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(APIException.class)
    public ResponseEntity<ErrorMessage> handleAPIException(APIException exception){
        errorMessage.setMessage(exception.getMessage());
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }
}

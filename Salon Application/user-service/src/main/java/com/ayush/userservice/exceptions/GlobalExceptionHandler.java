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
    @ExceptionHandler(org.springframework.web.client.HttpStatusCodeException.class)
    public ResponseEntity<ErrorMessage> handleHttpStatusCodeException(org.springframework.web.client.HttpStatusCodeException exception){
        String body = exception.getResponseBodyAsString();
        String message = body;
        if (body.contains("\"errorMessage\":\"")) {
            message = body.substring(body.indexOf("\"errorMessage\":\"") + 16, body.indexOf("\"", body.indexOf("\"errorMessage\":\"") + 16));
        } else if (body.contains("\"error\":\"")) {
            message = body.substring(body.indexOf("\"error\":\"") + 9, body.indexOf("\"", body.indexOf("\"error\":\"") + 9));
        }
        ErrorMessage error = new ErrorMessage();
        error.setMessage(message);
        return new ResponseEntity<>(error, exception.getStatusCode());
    }
}

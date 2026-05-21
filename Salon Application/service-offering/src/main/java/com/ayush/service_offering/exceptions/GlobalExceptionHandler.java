package com.ayush.service_offering.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ExceptionMessage>
    handleResourceNotFoundException(
            ResourceNotFoundException e){

        ExceptionMessage error =
                new ExceptionMessage(
                        e.getMessage(),
                        false
                );

        return new ResponseEntity<>(
                error,
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(APIException.class)
    public ResponseEntity<ExceptionMessage>
    handleAPIException(APIException e){

        ExceptionMessage error =
                new ExceptionMessage(
                        e.getMessage(),
                        false
                );

        return new ResponseEntity<>(
                error,
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionMessage>
    handleValidationException(
            MethodArgumentNotValidException ex){

        String message = ex.getBindingResult()
                .getFieldError()
                .getDefaultMessage();

        ExceptionMessage error =
                new ExceptionMessage(
                        message,
                        false
                );

        return new ResponseEntity<>(
                error,
                HttpStatus.BAD_REQUEST
        );
    }
}
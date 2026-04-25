package com.agenday.iam.application.exception;

import com.agenday.iam.application.exception.InvalidCredentialsException;
import com.agenday.iam.application.exception.UserAlreadyExistsException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<String> handleConflict(UserAlreadyExistsException ex) {
        return ResponseEntity.status(409).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<String> handleUnauthorized(InvalidCredentialsException ex) {
        return ResponseEntity.status(401).body(ex.getMessage());
    }
}
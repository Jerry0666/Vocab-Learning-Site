package com.exception;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<?> handleDuplicateError(DuplicateResourceException e) {
        System.out.println("[exception] handle Duplicate Error");
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<?> handleDataAccessError(DataAccessException ex) {
        System.out.println("[exception] handle Data Access Error");
        System.out.println("error message: " + ex.getMostSpecificCause().getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "資料庫錯誤",
                            "message",ex.getMostSpecificCause().getMessage()));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleLoginError(UserNotFoundException ex) {
        System.out.println("[exception] handle login error.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error","帳號或密碼錯誤"));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<?> handleNoSuchElement(NoSuchElementException ex) {
        System.out.println("[exception] No such element");
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error",ex.getMessage()));
    }

}

package com.example.toolmanagingsystem.controller;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.error.BusinessError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class AppExceptionHandler extends ResponseEntityExceptionHandler
{
    @ExceptionHandler(BusinessError.class)
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<ApiResponse> handleBusinessError(
            BusinessError exception
    ) {
        return ResponseEntity.ok(ApiResponse.error(exception));
    }
}

package com.example.toolmanagingsystem.controller;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.error.BusinessError;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@RestControllerAdvice
public class AppExceptionHandler extends ResponseEntityExceptionHandler
{
    @ExceptionHandler(BusinessError.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse> handleBusinessError(BusinessError businessError) {

        log.debug("Exception Handler for Business Error");
        log.debug("{}", businessError);

        return ResponseEntity.badRequest().body(ApiResponse.error(businessError));
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ApiResponse> handleException(Exception exception)
    {
        log.debug("Exception Handler for INTERNAL_SERVER_ERROR");

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.internalServerError(exception));
    }
}

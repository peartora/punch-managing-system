package com.example.toolmanagingsystem.controller;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExceptionResponse
{
    private String error;
    private LocalDateTime timeStamp;

    public ExceptionResponse(String error)
    {
        this.error = error;
        this.timeStamp = LocalDateTime.now();
    }
}

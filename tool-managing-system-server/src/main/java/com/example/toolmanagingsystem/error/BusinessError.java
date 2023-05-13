package com.example.toolmanagingsystem.error;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public abstract class BusinessError extends RuntimeException
{
    private final String code;
    private final String message;
    private final Object detail;
}

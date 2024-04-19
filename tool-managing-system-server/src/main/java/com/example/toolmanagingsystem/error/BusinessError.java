package com.example.toolmanagingsystem.error;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public abstract class BusinessError extends RuntimeException
{
    @Nonnull
    private final String code;
    @Nonnull
    private final String message;
    @Nullable
    private final Object detail;
}

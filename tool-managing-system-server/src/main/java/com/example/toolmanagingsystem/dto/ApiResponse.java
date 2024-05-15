package com.example.toolmanagingsystem.dto;

import com.example.toolmanagingsystem.error.BusinessError;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Getter
public final class ApiResponse
{
    @RequiredArgsConstructor
    @Getter
    public static class SuccessResponse {
        @NonNull
        private final Object data; // 혹은 Map type이 되어야 함.
    }

    @RequiredArgsConstructor
    @Getter
    public static class ErrorResponse {
        @NonNull
        private final String code;
        @NonNull
        private final String message;
        private final Object detail;
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private SuccessResponse success;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private ErrorResponse error;

    public static ApiResponse success(Object data) {
        ApiResponse res = new ApiResponse();
        res.success = new SuccessResponse(data);
        return res;
    }

    public static ApiResponse error(BusinessError error) {
        ApiResponse res = new ApiResponse();
        res.error = new ErrorResponse(error.getCode(), error.getMessage(), error.getDetail());
        return res;
    }
}

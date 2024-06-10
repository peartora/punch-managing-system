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
        System.out.println("ApiResponse.Success called");
        ApiResponse res = new ApiResponse();

        System.out.println("res");
        System.out.println(res);

        System.out.println("data");
        System.out.println(data);

        res.success = new SuccessResponse(data);

        System.out.println("res.success");
        System.out.println(res.success);

        return res;
    }

    public static ApiResponse error(BusinessError error) {
        System.out.println("ApiResponse.error called");

        ApiResponse res = new ApiResponse();
        res.error = new ErrorResponse(error.getCode(), error.getMessage(), error.getDetail());
        return res;
    }

    public static ApiResponse internalServerError(Exception error) {
        System.out.println("ApiResponse.internalServerError called");

        ApiResponse res = new ApiResponse();
        res.error = new ErrorResponse("INTERNAL_SERVER_ERROR", "서버에서 알 수 없는 에러가 발생했습니다.", error);
        return res;
    }
}

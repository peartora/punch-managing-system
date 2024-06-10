package com.example.toolmanagingsystem.dto.response.user;

import lombok.Data;

@Data
public class ResetPasswordResponseDto
{
    private String username;
    private boolean isPasswordReset;
    private boolean isPasswordSameWithCurrentPassword;
    private boolean isPasswordLongEnough;

    public ResetPasswordResponseDto(String username)
    {
        this.username = username;
    }

}

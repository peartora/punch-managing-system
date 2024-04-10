package com.example.toolmanagingsystem.dto.response;

import lombok.Data;

@Data
public class UserRegisterResponseDto
{
    private String username;
    private boolean isDuplicate;
    private boolean isRegistered;
    private boolean isPasswordSameWithConfirmation;
    private boolean isPasswordLongEnough;

    public UserRegisterResponseDto(String username) {
        this.username = username;
    }

    @Override
    public String toString()
    {
        return "UserRegisterResponseDto{" +
                "username='" + username + '\'' +
                ", isDuplicate=" + isDuplicate +
                ", isRegistered=" + isRegistered +
                ", isPasswordSameWithConfirmation=" + isPasswordSameWithConfirmation +
                ", isPasswordLongEnough=" + isPasswordLongEnough +
                '}';
    }
}

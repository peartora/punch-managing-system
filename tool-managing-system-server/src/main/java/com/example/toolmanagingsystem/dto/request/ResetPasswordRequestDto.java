package com.example.toolmanagingsystem.dto.request;

import lombok.Data;

@Data
public class ResetPasswordRequestDto
{
    private String username;
    private String newPassword;

    @Override
    public String toString() {
        return "username: " + this.username + " ," +
                "newPassword: " + this.newPassword;
    }
}

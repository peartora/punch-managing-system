package com.example.toolmanagingsystem.dto.request.user;

import lombok.Data;

@Data
public class ResetPasswordRequestDto
{
    private String username;
    private String loginUsername;
    private String newPassword;

    @Override
    public String toString() {
        return "username: " + this.username + " ," +
                "loginUsername: " + this.loginUsername + ", " +
                "newPassword: " + this.newPassword;
    }
}

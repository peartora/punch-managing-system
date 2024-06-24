package com.example.toolmanagingsystem.dto.request.user;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequestDto
{
    private String username;
    private String loginUsername;
    @Size(min = 6)
    private String newPassword;

    @Override
    public String toString() {
        return "username: " + this.username + " ," +
                "loginUsername: " + this.loginUsername + ", " +
                "newPassword: " + this.newPassword;
    }
}

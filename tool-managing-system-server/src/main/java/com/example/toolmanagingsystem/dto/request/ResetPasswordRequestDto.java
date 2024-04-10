package com.example.toolmanagingsystem.dto.request;

import lombok.Data;

@Data
public class ResetPasswordRequestDto
{
    private String username;
    private String password;

    @Override
    public String toString() {
        return "username: " + this.username + " ," +
                "password: " + this.password;
    }
}

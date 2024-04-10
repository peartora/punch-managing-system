package com.example.toolmanagingsystem.dto.request;

import lombok.Data;

@Data
public class UserRegisterRequestDto
{
    private String username;
    private String password;
    private String passwordConfirmation;
    private String role;
    @Override
    public String toString()
    {
        return "UserRegisterRequestDto{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", passwordConfirmation='" + passwordConfirmation + '\'' +
                ", userRole='" + role + '\'' +
                '}';
    }
}

package com.example.toolmanagingsystem.dto.request;

import lombok.Data;

@Data
public class UserRegisterDto
{
    private String id;
    private String password;
    private String role;

    @Override
    public String toString()
    {
        return "UserRegisterDto{" +
                "username='" + id + '\'' +
                ", password='" + password + '\'' +
                ", userRole='" + role + '\'' +
                '}';
    }
}

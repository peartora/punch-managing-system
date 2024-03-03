package com.example.toolmanagingsystem.dto;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

@Data
public class UserDto
{
    private String id;
    private String password;
    private String role;

    @Override
    public String toString()
    {
        return "UserDto{" +
                "username='" + id + '\'' +
                ", password='" + password + '\'' +
                ", userRole='" + role + '\'' +
                '}';
    }
}

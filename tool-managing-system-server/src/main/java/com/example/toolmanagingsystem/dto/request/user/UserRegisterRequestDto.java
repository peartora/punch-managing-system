package com.example.toolmanagingsystem.dto.request.user;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.validation.annotation.Validated;

@Data
public class UserRegisterRequestDto
{
    @NotNull
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

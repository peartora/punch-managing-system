package com.example.toolmanagingsystem.dto.request.user;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.validation.annotation.Validated;

@Data
public class UserRegisterRequestDto
{
    @NotNull
    private String username;
    @Size(min = 6)
    private String password;
    @Size(min = 6)
    private String passwordConfirmation;
    @NotNull
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

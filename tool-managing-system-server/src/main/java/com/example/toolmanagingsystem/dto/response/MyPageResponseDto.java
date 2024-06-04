package com.example.toolmanagingsystem.dto.response;

import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.entity.user.UserRole;
import jakarta.annotation.Nullable;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class MyPageResponseDto
{
    protected String username;
    private UserRole userRole;
    private LocalDate passwordSetDate;
    private LocalDate passwordValidUntil;

    public MyPageResponseDto(String username, UserRole userRole, LocalDate passwordSetDate) {
        this.username = username;
        this.userRole = userRole;
        this.passwordSetDate = passwordSetDate;
        this.passwordValidUntil = passwordSetDate.plusMonths(6);
    }

}

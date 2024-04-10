package com.example.toolmanagingsystem.dto.response.myPageResponseDto;

import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.entity.user.UserRole;
import jakarta.annotation.Nullable;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class PageResponseDtoForNotAdmin extends MyPageResponseDto
{

    private UserRole userRole;
    private LocalDate passwordSetDate;
    private LocalDate passwordValidUntil;

    public PageResponseDtoForNotAdmin(String username) {
        this.username = username;
    }
}

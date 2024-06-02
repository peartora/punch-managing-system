package com.example.toolmanagingsystem.dto.response.myPageResponseDto;

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
    @Nullable
    private List<User> userList = new ArrayList<>();

    public void setUserList(Iterable<User> userIterable)
    {
        for (User user: userIterable)
        {
            userList.add(user);
        }
    }

    public void setOneUserList(User user)
    {
        userList.add(user);
    }

    public MyPageResponseDto(String username, UserRole userRole, LocalDate passwordSetDate) {
        this.username = username;
        this.userRole = userRole;
        this.passwordSetDate = passwordSetDate;
        this.passwordValidUntil = passwordSetDate.plusMonths(6);
    }

}

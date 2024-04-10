package com.example.toolmanagingsystem.dto.response.myPageResponseDto;

import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.entity.user.UserRole;
import jakarta.annotation.Nullable;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class PageResponseDtoForAdmin extends MyPageResponseDto
{
    private List<User> userList = new ArrayList<>();

    public void setUserList(Iterable<User> userIterable)
    {
        for (User user: userIterable)
        {
            userList.add(user);
        }
    }

    public PageResponseDtoForAdmin(String username) {
        this.username = username;
    }
}

package com.example.toolmanagingsystem.dto.response.myPageResponseDto;

import lombok.Data;

@Data
public abstract class MyPageResponseDto
{
    protected String username;
    protected boolean isAdmin;
}

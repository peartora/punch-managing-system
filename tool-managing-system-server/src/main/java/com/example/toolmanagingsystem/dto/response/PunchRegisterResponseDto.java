package com.example.toolmanagingsystem.dto.response;

import lombok.Data;

@Data
public class PunchRegisterResponseDto
{
    private int count;
    private String message;

    public PunchRegisterResponseDto(int count, String message)
    {
        this.count = count;
        this.message = message;
    }
}

package com.example.toolmanagingsystem.dto.response;

import lombok.Data;

@Data
public class PunchScrapResponseDto
{
    private String punchId;

    public PunchScrapResponseDto(String punchId)
    {
        this.punchId = punchId;
    }
}

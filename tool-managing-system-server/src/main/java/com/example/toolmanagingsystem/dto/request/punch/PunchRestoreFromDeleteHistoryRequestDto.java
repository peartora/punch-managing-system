package com.example.toolmanagingsystem.dto.request.punch;

import lombok.Data;

@Data
public class PunchRestoreFromDeleteHistoryRequestDto {
    private String username;
    private String punch;
    private String previousPunchStatus;
}

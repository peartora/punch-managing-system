package com.example.toolmanagingsystem.dto.request.punch;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PunchAddCleanHistoryRequestDto {
    private String punchId;
    private String punchStatus;
    private LocalDateTime cleanTimeDate;
    private String batch;
    private String comment;
    private String username;

    @Override
    public String toString() {
        return "PunchAddCleanHistoryRequestDto{" +
                "punchId='" + punchId + '\'' +
                ", punchStatus=" + punchStatus +
                ", cleanTimeDate='" + cleanTimeDate + '\'' +
                ", batch='" + batch + '\'' +
                ", comment='" + comment + '\'' +
                ", username='" + username + '\'' +
                '}';
    }
}

package com.example.toolmanagingsystem.entity.logging;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity(name = "log")
@Data
public class Logging
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String username;
    @Enumerated(EnumType.STRING)
    private LoggingActivity activity;
    @Column(name = "date_time")
    private LocalDateTime dateTime;

    public Logging(String username, LoggingActivity activity, LocalDateTime dateTime)
    {
        this.username = username;
        this.activity = activity;
        this.dateTime = dateTime;
    }

    public Logging() {}

}

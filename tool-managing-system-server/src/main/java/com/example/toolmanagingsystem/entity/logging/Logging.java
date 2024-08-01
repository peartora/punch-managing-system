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
    @Column(name = "remarks")
    private String remarks;
    public Logging(String username, LoggingActivity activity, String remarks)
    {
        this.username = username;
        this.activity = activity;
        this.dateTime = LocalDateTime.now();
        this.remarks = remarks;
    }

    public Logging(String username, LoggingActivity activity)
    {
        this.username = username;
        this.activity = activity;
        this.dateTime = LocalDateTime.now();
    }


    public Logging() {}

}

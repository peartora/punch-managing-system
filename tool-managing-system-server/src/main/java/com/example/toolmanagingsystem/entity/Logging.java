package com.example.toolmanagingsystem.entity;

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
    private LogActivity activity;
    @Column(name = "date_time")
    private LocalDateTime dateTime;

    public Logging(String username, LogActivity activity, LocalDateTime dateTime)
    {
        this.username = username;
        this.activity = activity;
        this.dateTime = dateTime;
    }

    public Logging() {}

}

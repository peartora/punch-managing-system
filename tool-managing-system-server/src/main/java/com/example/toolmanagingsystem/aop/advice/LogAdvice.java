package com.example.toolmanagingsystem.aop.advice;


import com.example.toolmanagingsystem.entity.logging.Logging;
import com.example.toolmanagingsystem.entity.logging.LoggingActivity;
import com.example.toolmanagingsystem.repository.LoggingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class LogAdvice
{
    @Autowired
    LoggingRepository loggingRepository;

    public void logging(String username, LoggingActivity activity)
    {
        Logging logging = new Logging(username, activity, LocalDateTime.now());
        this.loggingRepository.save(logging);
    }
}

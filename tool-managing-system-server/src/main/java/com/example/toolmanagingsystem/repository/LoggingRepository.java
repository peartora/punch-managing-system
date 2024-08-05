package com.example.toolmanagingsystem.repository;

import com.example.toolmanagingsystem.entity.logging.Logging;
import com.example.toolmanagingsystem.entity.logging.LoggingActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface LoggingRepository extends JpaRepository<Logging, Long>
{
    @Query("SELECT log.username FROM log l")
    List<String> returnUserList();

    @Query("SELECT log.activity FROM log l")
    List<LoggingActivity> returnActivityList();
}

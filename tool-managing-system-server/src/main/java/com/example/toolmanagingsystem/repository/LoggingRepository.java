package com.example.toolmanagingsystem.repository;

import com.example.toolmanagingsystem.entity.logging.Logging;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface LoggingRepository extends JpaRepository<Logging, Long>
{

}

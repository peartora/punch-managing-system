package com.example.toolmanagingsystem.repository;

import com.example.toolmanagingsystem.entity.CleanHistory;
import com.example.toolmanagingsystem.entity.Inspection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CleanHistoryRepository extends JpaRepository<CleanHistory, Long> {
}

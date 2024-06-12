package com.example.toolmanagingsystem.repository;

import com.example.toolmanagingsystem.entity.CleanHistory;
import com.example.toolmanagingsystem.entity.Inspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CleanHistoryRepository extends JpaRepository<CleanHistory, Long> {

    @Query("select c from CleanHistory c where c.punchNumber = :punchId")
    List<CleanHistory> returnCleanHistoryListByPunchId(String punchId);
}

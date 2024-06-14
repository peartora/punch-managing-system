package com.example.toolmanagingsystem.repository.punch;

import com.example.toolmanagingsystem.entity.punch.Punch;
import com.example.toolmanagingsystem.entity.punch.PunchDelete;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PunchDeleteRepository extends JpaRepository<PunchDelete, Long>
{
    List<PunchDelete> findByMedicine(String medicineName);
    void deleteByPunch(String punchId);

}

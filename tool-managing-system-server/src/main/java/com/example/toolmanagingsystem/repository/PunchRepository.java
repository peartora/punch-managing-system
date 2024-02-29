package com.example.toolmanagingsystem.repository;

import com.example.toolmanagingsystem.entity.Punch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PunchRepository extends JpaRepository<Punch, Long>
{
}

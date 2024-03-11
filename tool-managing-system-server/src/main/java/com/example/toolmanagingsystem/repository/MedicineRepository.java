package com.example.toolmanagingsystem.repository;

import com.example.toolmanagingsystem.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long>
{
    Medicine findByMedicine(String medicine);
}

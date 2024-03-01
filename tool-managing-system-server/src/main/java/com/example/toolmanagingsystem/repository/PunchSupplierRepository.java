package com.example.toolmanagingsystem.repository;

import com.example.toolmanagingsystem.entity.PunchSupplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PunchSupplierRepository extends JpaRepository<PunchSupplier, Long>
{
    PunchSupplier findBySupplier(String supplier);
}

package com.example.toolmanagingsystem.repository;

import com.example.toolmanagingsystem.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long>
{
    Supplier findBySupplier(String supplier);
}

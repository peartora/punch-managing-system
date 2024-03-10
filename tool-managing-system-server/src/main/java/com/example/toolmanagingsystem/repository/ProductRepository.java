package com.example.toolmanagingsystem.repository;

import com.example.toolmanagingsystem.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Medicine, Long>
{
    Medicine findByProduct(String product);
}

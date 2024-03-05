package com.example.toolmanagingsystem.repository;

import com.example.toolmanagingsystem.entity.Punch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PunchRepository extends JpaRepository<Punch, Long>
{
    List<Punch> findByRegisterDateBetweenAndTypeAndSupplierAndStatusAndLocationAndProductAndPtype(
        String startDate, String endDate, String type, String supplier, String status, String location, String product, String ptype
    );
}

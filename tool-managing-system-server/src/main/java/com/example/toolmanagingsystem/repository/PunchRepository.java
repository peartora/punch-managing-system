package com.example.toolmanagingsystem.repository;

import com.example.toolmanagingsystem.entity.punch.Punch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PunchRepository extends JpaRepository<Punch, Long>, JpaSpecificationExecutor<Punch>
{
    Punch findByPunchId(String punchId);
    @Query("SELECT p FROM punch p " +
        "WHERE p.date >= :startDate AND " +
        "p.date <= :endDate AND " +
        "p.punchPosition = :punchPosition AND " +
        "p.supplier = :supplier AND " +
        "p.punchStatus = :strStatus AND " +
        "p.punchStatus = :punchStatus AND " +
        "p.storageLocation = :storageLocation AND " +
        "p.medicine = :medicine AND " +
        "p.medicineType = :medicineType")
    List<Punch> findPunchListByAttributes(
                @Param("startDate") LocalDate startDate,
                @Param("endDate") LocalDate endDate,
                @Param("punchPosition") String punchPosition,
                @Param("supplier") String supplier,
                @Param("strStatus") String strStatus,
                @Param("punchStatus") String punchStatus,
                @Param("storageLocation") String storageLocation,
                @Param("medicine") String medicine,
                @Param("medicineType") String medicineType
        );
}

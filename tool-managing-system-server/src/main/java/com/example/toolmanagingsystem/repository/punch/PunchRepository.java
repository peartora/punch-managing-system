package com.example.toolmanagingsystem.repository.punch;

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

    @Query("select p from punch p")
    List<Punch> findAllPunch();

//    @Query("select p from punch p join CleanHistory c on p.punchId = c.punchNumber")
//    List<Punch> findAllPunch();

    @Query("select p from punch p where " +
            "(:startDate is null or p.date >= :startDate) and " +
            "(:endDate is null or p.date <= :endDate) and " +
            "(:punchPosition = 'All' or p.punchPosition = :punchPosition) and " +
            "(:supplier = 'All' or p.supplier = :supplier) and " +
            "(:status = 'All' or p.punchStatus = :status) and " +
            "(:medicine = 'All' or p.medicine = :medicine) and " +
            "(:medicineType = 'All' or p.medicineType = :medicineType)")
    List<Punch> findFilteredPunch(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("punchPosition") String punchPosition,
            @Param("supplier") String supplier,
            @Param("status") String status,
            @Param("medicine") String medicine,
            @Param("medicineType") String medicineType
    );
}

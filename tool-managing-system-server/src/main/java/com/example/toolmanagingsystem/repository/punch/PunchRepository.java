package com.example.toolmanagingsystem.repository.punch;

import com.example.toolmanagingsystem.dto.response.PunchWithInspectionDateResponseDto;
import com.example.toolmanagingsystem.entity.Medicine;
import com.example.toolmanagingsystem.entity.Supplier;
import com.example.toolmanagingsystem.entity.punch.Punch;
import com.example.toolmanagingsystem.entity.punch.PunchStatus;
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
    List<Punch> findAll();

    @Query(
            "select p from punch p where " +
                    "(:punchStatus is null or p.punchStatus = :punchStatus) and " +
                    "(:punchPosition is null or p.punchPosition = :punchPosition) and " +
                    "(:medicineType is null or p.medicineType = :medicineType) and " +
                    "(:supplier is null or p.supplier = :supplier) and " +
                    "(:medicine is null or p.medicine = :medicine) and " +
                    "(:startDate is null or :endDate is null or p.date between :startDate and :endDate)"
    )
    List<Punch> findSelectedPunch(
            @Param("punchStatus") PunchStatus punchStatus,
            @Param("punchPosition") String punchPosition,
            @Param("medicineType") String medicineType,
            @Param("supplier") Supplier supplier,
            @Param("medicine") Medicine medicine,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT new com.example.toolmanagingsystem.dto.response.PunchWithInspectionDateResponseDto(" +
                "p.punchId, " +
                "p.date, " +
                "p.punchPosition, " +
                "p.supplier, " +
                "p.punchStatus, " +
                "p.specification, " +
                "p.medicine, " +
                "p.medicineType, " +
                "i.date, " +
                "i.filePath " +
                ") " +
            "FROM " +
                "punch p LEFT JOIN inspection i " +
            "ON p.punchId = i.punchNumber " +
            "where " +
            "(:punchStatus is null or p.punchStatus = :punchStatus) and " +
            "(:punchPosition is null or p.punchPosition = :punchPosition) and " +
            "(:medicineType is null or p.medicineType = :medicineType) and " +
            "(:supplier is null or p.supplier = :supplier) and " +
            "(:medicine is null or p.medicine = :medicine) and " +
            "(:startDate is null or :endDate is null or p.date between :startDate and :endDate)"

    )
    List<PunchWithInspectionDateResponseDto> findFilteredPunchWithInspectionDate(
            @Param("punchStatus") PunchStatus punchStatus,
            @Param("punchPosition") String punchPosition,
            @Param("medicineType") String medicineType,
            @Param("supplier") Supplier supplier,
            @Param("medicine") Medicine medicine,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT new com.example.toolmanagingsystem.dto.response.PunchWithInspectionDateResponseDto(" +
            "p.punchId, " +
            "p.date, " +
            "p.punchPosition, " +
            "p.supplier, " +
            "p.punchStatus, " +
            "p.specification, " +
            "p.medicine, " +
            "p.medicineType, " +
            "i.date, " +
            "i.filePath " +
            ") " +
            "FROM " +
            "punch p LEFT JOIN inspection i " +
            "ON p.punchId = i.punchNumber "

    )
    List<PunchWithInspectionDateResponseDto> findPunchWithInspectionDate();
}

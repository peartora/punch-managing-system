package com.example.toolmanagingsystem.controller;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.MedicineRegisterRequestDto;
import com.example.toolmanagingsystem.entity.Medicine;
import com.example.toolmanagingsystem.error.medicine.MedicineAlreadyExistedException;
import com.example.toolmanagingsystem.error.medicine.SpecificationFileNotExistException;
import com.example.toolmanagingsystem.repository.MedicineRepository;
import com.example.toolmanagingsystem.utils.FileHandling;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/tool-managing-system/meidicine")
@RequiredArgsConstructor
public class MedicineApiController
{
    private final MedicineRepository medicineRepository;

    @Value("${TOOL_MANAGING_SYSTEM_STATIC_PATH}")
    private String staticPath;

    @PostMapping(consumes = {"multipart/form-data"})
    public ApiResponse registerMedicine(
            @RequestPart("medicine") String medicineName,
            @RequestPart("specificationFile") MultipartFile specificationFile
    )
    {
        System.out.println("registerMedicine");

        String filePath = this.saveSpecificationFile(specificationFile);
        Medicine medicine = new Medicine(medicineName, filePath);

        try
        {
            this.medicineRepository.save(medicine);
        }
        catch (Exception e)
        {
            throw new MedicineAlreadyExistedException();
        }

        if (medicine.getSpecificationPath() == null)
        {
            throw new SpecificationFileNotExistException();
        }

        return ApiResponse.success(medicineName);
    }

    @GetMapping("/getMedicine")
    public List<String> returnMedicine()
    {
        List<Medicine> medicineList = this.medicineRepository.findAll();

        List<String> medicineNameList = new ArrayList<>();

        for (Medicine medicine: medicineList)
        {
            medicineNameList.add(medicine.getMedicine());
        }
        return medicineNameList;
    }

    private String saveSpecificationFile(MultipartFile specificationFile)
    {
        String fileName = specificationFile.getOriginalFilename();
        String strFilePath = this.staticPath + "resources\\pdf\\specification\\" + fileName;

        FileHandling.fileHandling(strFilePath, specificationFile);

        return strFilePath;
    }

    @PostMapping("/updateBatchInfor")
    public int updateBatchSize(
            @RequestParam(value = "product") String productName,
            @RequestParam(value = "specificationFile", required = false) MultipartFile specificationFile
    )
    {
        String strFilePath = this.saveSpecificationFile(specificationFile);

        Medicine medicineBeforeUpdate = this.medicineRepository.findByMedicine(productName);
        medicineBeforeUpdate.setSpecificationPath(strFilePath);

        try
        {
            this.medicineRepository.save(medicineBeforeUpdate);
            return 1;
        }
        catch (Exception e)
        {
            return 0;
        }
    }

}

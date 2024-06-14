package com.example.toolmanagingsystem.controller;

import com.example.toolmanagingsystem.dao.PunchDao;
import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.punch.*;
import com.example.toolmanagingsystem.entity.*;
import com.example.toolmanagingsystem.entity.punch.Punch;
import com.example.toolmanagingsystem.entity.punch.PunchDelete;
import com.example.toolmanagingsystem.entity.punch.PunchStatus;
import com.example.toolmanagingsystem.error.NoCleanHistoryException;
import com.example.toolmanagingsystem.error.punch.DBError;
import com.example.toolmanagingsystem.error.punch.DeletePunchListNotExistException;
import com.example.toolmanagingsystem.error.punch.PunchIdAlreadyExistedException;
import com.example.toolmanagingsystem.error.punch.PunchIdNotExistedException;
import com.example.toolmanagingsystem.repository.*;
import com.example.toolmanagingsystem.repository.punch.PunchDeleteRepository;
import com.example.toolmanagingsystem.repository.punch.PunchRepository;
import com.example.toolmanagingsystem.utils.FileHandling;
import com.example.toolmanagingsystem.vo.InspectionHistoryVO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Column;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/tool-managing-system/punch")
@RequiredArgsConstructor
public class PunchApiController
{
//    private final Logger logger;

    private final PunchRepository punchRepository;
    private final MedicineRepository medicineRepository;
    private final SupplierRepository punchSupplierRepository;
    private final PunchDeleteRepository punchDeleteRepository;
    private final InsepctionRepository inspectionRepository;
    private final CleanHistoryRepository cleanHistoryRepository;
    private final PunchDao dao;

    @Value("${TOOL_MANAGING_SYSTEM_STATIC_PATH}")
    private String staticPath;

    @PostMapping()
    public ApiResponse registerPunch(@RequestBody List<PunchRegisterRequestDto> punchRegisterRequestDtoList)
    {
        System.out.println("registerPunch");
        System.out.println(punchRegisterRequestDtoList);

        List<Punch> entityList = new ArrayList<>();

        for (PunchRegisterRequestDto punchRegisterRequestDto : punchRegisterRequestDtoList)
        {
            String supplier = punchRegisterRequestDto.getSupplier();
            Supplier punchSupplier = this.punchSupplierRepository.findBySupplier(supplier);

            String medicineName = punchRegisterRequestDto.getMedicine();
            Medicine medicine = this.medicineRepository.findByMedicine(medicineName);
            String specificationPath = medicine.getSpecificationPath();

            Punch entity = new Punch(punchRegisterRequestDto, punchSupplier, medicine);
            entity.setSpecification(specificationPath);
            entityList.add(entity);
        }

        List<Punch> registeredPunchList = new ArrayList<>();

        try
        {
            registeredPunchList = this.punchRepository.saveAll(entityList);
        }
        catch (Exception e)
        {
            throw new PunchIdAlreadyExistedException();
        }
        return ApiResponse.success(registeredPunchList.size());
    }

    @GetMapping()
    public ApiResponse returnPunchList(@RequestParam HashMap<String, Object> params) // 단일 값을 받던지, 다수를 받으려면 Map;
    {
        System.out.println("====================returnPunchList====================");
        System.out.println(params);

        List<Punch> punchList = new ArrayList<>();


        if (params.isEmpty())
        {
             punchList = this.punchRepository.findAllPunch();
        }
        else
        {
            System.out.println("YES");

            LocalDate startDate = (LocalDate) params.get("startDate");
            LocalDate endDate = (LocalDate) params.get("endDate");
            String punchPosition = (String) params.get("punchPosition");
            String supplier = (String) params.get("supplier");
            String status = (String) params.get("status");
            String medicine = (String) params.get("medicine");
            String medicineType = (String) params.get("medicineType");

            punchList = this.punchRepository.findFilteredPunch(startDate, endDate, punchPosition, supplier, status, medicine, medicineType);

            System.out.println(punchList);

        }


        return ApiResponse.success(punchList);
//        List<Punch> punchList = new ArrayList<>();
//        List<Punch> filteredPunchList = new ArrayList<>();
//
//        Iterable<Punch> punchIterable = this.punchRepository.findAll();
//        for (Punch punch: punchIterable)
//        {
//            punchList.add(punch);
//        }
//
//        if (params.isEmpty()) {
//            return ApiResponse.success(punchList);
//        } else {
//            for (Punch punch: punchList)
//            {
//                if (this.filterPunch(punch, params)) {
//                    filteredPunchList.add(punch);
//                }
//            }
//            return ApiResponse.success(filteredPunchList);
//        }
    }

    @PostMapping("/updateStatus")
    public ApiResponse updateNewStatus(@RequestBody List<PunchStatusUpdateRequestDto> punchStatusUpdateRequestDtoList)
    {
        System.out.println("updateNewStatus");

        List<Punch> punchList = new ArrayList<>();

        for (PunchStatusUpdateRequestDto punchStatusUpdateRequestDto : punchStatusUpdateRequestDtoList)
        {
            System.out.println("punchStatusUpdateRequestDto");
            System.out.println(punchStatusUpdateRequestDto);

            String punchId = punchStatusUpdateRequestDto.getPunchId();

            Punch punch = this.punchRepository.findByPunchId(punchId);

            if (punch == null)
            {
                throw new PunchIdNotExistedException();
            }

            punch.setPunchStatus(PunchStatus.valueOf(punchStatusUpdateRequestDto.getNewStatus()));
            punchList.add(punch);
        }
        try
        {
            this.punchRepository.saveAll(punchList);
        }
        catch (Exception e)
        {
            throw new DBError();
        }
        return ApiResponse.success(punchList.size());
    }

    @PostMapping("")
    public ApiResponse restorePunchFromDeleteHistory(@RequestBody PunchRestoreFromDeleteHistoryRequestDto punchRestoreFromDeleteHistoryRequestDto)
    {
        System.out.println("restorePunchFromDeleteHistory");
        System.out.println(punchRestoreFromDeleteHistoryRequestDto);

        String username = punchRestoreFromDeleteHistoryRequestDto.getUsername();
        User user = this.

        if ()




    }







    @PostMapping("/recover")
    public int recoverPunchFromDeleteStatus(@RequestBody Map<String, Object> params)
    {
        System.out.println("recoverPunchFromDeleteStatus");
        System.out.println("params");
        System.out.println(params);

        return this.dao.updateNewStatusForRecoveryPunch(params);
    }

    @PostMapping("/delete")
    public int deletePunchFromDeleteHistory(@RequestBody Map<String, Object> params)
    {
        System.out.println("deletePunchFromDeleteHistory");
        System.out.println(params);
        System.out.println("params");

        return this.dao.deletePunchFromDeleteHistory(params);
    }

    @Transactional
    @PostMapping("/updateStatus/scrap")
    public ApiResponse scrapPunch(@RequestBody PunchScrapRequestDao punchScrapRequestDao)
    {
        System.out.println("scrapPunch");
        System.out.println(punchScrapRequestDao);

        Punch punch = this.punchRepository.findByPunchId(punchScrapRequestDao.getPunchId());

        if (punch == null)
        {
            throw new PunchIdNotExistedException();
        }

        PunchStatus previousPunchStatus = punch.getPunchStatus();

        punch.setPunchStatus(PunchStatus.폐기);
        this.punchRepository.save(punch);

        Medicine medicine = punch.getMedicine();
        String reason = punchScrapRequestDao.getReason();

        System.out.println("medicine");
        System.out.println(medicine);

        System.out.println("previousPunchStatus");
        System.out.println(previousPunchStatus);

        System.out.println("reason");
        System.out.println(reason);



        PunchDelete punchDelete = new PunchDelete(punch.getPunchId(), medicine.getMedicine(), previousPunchStatus, reason, LocalDate.now());
        try
        {
            this.punchDeleteRepository.save(punchDelete);
        }
        catch (Exception e)
        {
            throw new PunchIdAlreadyExistedException();
        }

        return ApiResponse.success(punch.getPunchId());
    }

    @PostMapping("/addCleanHistory")
    public ApiResponse addCleanHistory(@RequestBody List<PunchAddCleanHistoryRequestDto> requestDtoList)
    {
        System.out.println("addCleanHistory");
        System.out.println(requestDtoList);

        if (requestDtoList.size() == 0)
        {
            throw new NoCleanHistoryException();
        }

        List<CleanHistory> cleanHistoryList = new ArrayList<>();

        for (PunchAddCleanHistoryRequestDto requestDto: requestDtoList)
        {
            String punchNumber = requestDto.getPunchId();
            LocalDateTime date = requestDto.getCleanTimeDate();
            String username = requestDto.getUsername();
            String batch = requestDto.getBatch();
            String comment = requestDto.getComment();

            CleanHistory cleanHistory = new CleanHistory(punchNumber, date, username, batch, comment);
            cleanHistoryList.add(cleanHistory);
        }

        List<CleanHistory> savedCleanHistoryList = new ArrayList<>();

        try
        {
            savedCleanHistoryList = this.cleanHistoryRepository.saveAll(cleanHistoryList);
        }
        catch (Exception e)
        {
            throw new DBError();
        }
        return ApiResponse.success(savedCleanHistoryList.size());
    }

    @GetMapping("/getCleanHistory")
    public ApiResponse retrieveHistory(@RequestParam String punchId)
    {
        System.out.println("getCleanHistory");
        System.out.println(punchId);

        // punchId 검사 로직?
        Punch punch = this.punchRepository.findByPunchId(punchId);

        if (punch == null)
        {
            throw new PunchIdNotExistedException();
        }

        List<CleanHistory> cleanHistoryList = this.cleanHistoryRepository.returnCleanHistoryListByPunchId(punchId);
        return ApiResponse.success(cleanHistoryList);
    }

    @GetMapping("/getInspectionHistory")
    public List<InspectionHistoryVO> retrieveInspectionHistory(@RequestParam String punchId)
    {
        System.out.println("getInspectionHistory");
        System.out.println("punchId");
        System.out.println(punchId);

        return this.dao.retrievInspectionHistory(punchId);
    }

    @GetMapping("/getSpecification")
    public String retrieveSpecification(@RequestParam String punchId)
    {
        System.out.println("getSpecification");
        System.out.println("punchId");
        System.out.println(punchId);

        String result = this.dao.retrievSpecification(punchId);

        System.out.println(result);
        return this.dao.retrievSpecification(punchId);
    }

    @Transactional
    @PostMapping("/updateInspectionResultAndStatus")
    public ApiResponse updateInspectionResult(MultipartHttpServletRequest params) throws JsonProcessingException
    {
        System.out.println("updateInspectionResult");

        Map<String, MultipartFile> fileMap = params.getFileMap();
        String filePath = saveInspectionFile(fileMap.get("inspectionResultPdfFile"));

        String punchStatusUpdateJson = params.getParameter("punchStatusUpdateDto");
        ObjectMapper objectMapper = new ObjectMapper();
        List<Map<String, String>> punchStatusUpdateDtoMap = objectMapper.readValue(
                punchStatusUpdateJson, new TypeReference<List<Map<String, String>>>(){}
        );

        List<Inspection> inspectionList = new ArrayList<>();
        List<Punch> punchList = new ArrayList<>();

        for (Map<String, String> punchStatusUpdateDto: punchStatusUpdateDtoMap)
        {
            String punchId = punchStatusUpdateDto.get("punchId");

            Inspection inspection = new Inspection(punchId, LocalDateTime.now(), filePath);
            inspectionList.add(inspection);

            Punch punch = this.punchRepository.findByPunchId(punchId);

            if (punch == null) {
                throw new PunchIdNotExistedException();
            }

            punch.setPunchStatus(PunchStatus.사용가능);
            punchList.add(punch);
        }

        this.inspectionRepository.saveAll(inspectionList);
        List<Punch> savedPunchList = this.punchRepository.saveAll(punchList);

        return ApiResponse.success(savedPunchList.size());
    }





    @GetMapping("/created-date")
    public String returnCreatedDate(@RequestParam Map<String, Object> params)
    {
        System.out.println("returnCreatedDate");
        System.out.println(params);

        return dao.returnCreatedDate(params);
    }



    @PostMapping("/resetId")
    public String resetId(@RequestBody Map<String, Object> params)
    {
        System.out.println("resetId");
        System.out.println(params);

        int effectedRow = this.dao.resetId(params);

        if (effectedRow == 1)
        {
            return "OK";
        }
        else
        {
            return "NOK";
        }
    }

    @GetMapping("/getDeletedPunchList")
    public ApiResponse getDeletedPunchList(@RequestParam String medicineName)
    {
        System.out.println("getDeletedPunchList");
        System.out.println(medicineName);

        List<PunchDelete> punchDeleteList = new ArrayList<>();

        if (Objects.equals(medicineName, "All"))
        {
            punchDeleteList = this.punchDeleteRepository.findAll();
        }
        else
        {
            punchDeleteList = this.punchDeleteRepository.findByMedicine(medicineName);
        }

        if (punchDeleteList.size() == 0)
        {
            throw new DeletePunchListNotExistException();
        }

        return ApiResponse.success(punchDeleteList);

    }


    private String saveInspectionFile(MultipartFile specificationFile)
    {
        String fileName = specificationFile.getOriginalFilename();
        // String strFilePath = "C:\\Users\\lsm1dae\\Desktop\\inspection\\" + fileName;
        String strFilePath = this.staticPath + "resources\\pdf\\inspection\\" + fileName;

        FileHandling.fileHandling(strFilePath, specificationFile);

        return strFilePath;
    }




    private boolean filterPunch(Punch punch, HashMap<String, Object> params)
    {

        String strStartDate = (String) params.get("startDate");
        LocalDate startDate = LocalDate.parse(strStartDate);
        System.out.println("startDate:");
        System.out.println(startDate);


        String strEndDate = (String) params.get("endDate");
        LocalDate endDate = LocalDate.parse(strEndDate);
        System.out.println("endDate:");
        System.out.println(endDate);

        String punchPosition = (String) params.get("punchPosition");
        System.out.println("punchPosition:");
        System.out.println(punchPosition);

        String supplier = (String) params.get("supplier");
        System.out.println("supplier:");
        System.out.println(supplier);

        String strStatus = (String) params.get("status");
        System.out.println("strStatus:");
        System.out.println(strStatus);

        PunchStatus punchStatus = null;

        if (!Objects.equals(strStatus, "All")) {
            punchStatus = PunchStatus.valueOf(strStatus);
            System.out.println("punchStatus:");
            System.out.println(punchStatus);
        }

        String storageLocation = (String) params.get("storageLocation");
        System.out.println("storageLocation:");
        System.out.println(storageLocation);

        String medicine = (String) params.get("medicine");
        System.out.println("medicine:");
        System.out.println(medicine);

        String medicineType = (String) params.get("medicineType");
        System.out.println("medicineType:");
        System.out.println(medicineType);

        System.out.println("===========================================================");

        if (punch.getDate().isBefore(startDate) || punch.getDate().isAfter(endDate))
        {
            return false;
        }

        if (!Objects.equals(punchPosition, "All"))
        {
            if (!Objects.equals(punch.getPunchPosition(), punchPosition))
            {
                return false;
            }
        }

        if (!Objects.equals(supplier, "All"))
        {
            if (!Objects.equals(punch.getSupplier().getSupplier(), supplier))
            {
                return false;
            }
        }

        if (!Objects.equals(strStatus, "All"))
        {
            if (!Objects.equals(punch.getPunchStatus().toString(), punchStatus.toString()))
            {
                return false;
            }
        }

        if (!Objects.equals(medicine, "All"))
        {
            if (!Objects.equals(punch.getMedicine().getMedicine(), medicine))
            {
                return false;
            }
        }

        if (!Objects.equals(medicineType, "All"))
        {
            if (!Objects.equals(punch.getMedicineType(), medicineType))
            {
                return false;
            }
        }

        return true;
    }
}

package com.example.toolmanagingsystem.controller;

import com.example.toolmanagingsystem.dao.PunchDao;
import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.punch.*;
import com.example.toolmanagingsystem.dto.response.PunchWithInspectionDateResponseDto;
import com.example.toolmanagingsystem.entity.*;
import com.example.toolmanagingsystem.entity.logging.Logging;
import com.example.toolmanagingsystem.entity.logging.LoggingActivity;
import com.example.toolmanagingsystem.entity.punch.Punch;
import com.example.toolmanagingsystem.entity.punch.PunchDelete;
import com.example.toolmanagingsystem.entity.punch.PunchStatus;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.entity.user.UserRole;
import com.example.toolmanagingsystem.error.NoCleanHistoryException;
import com.example.toolmanagingsystem.error.punch.DBError;
import com.example.toolmanagingsystem.error.punch.DeletePunchListNotExistException;
import com.example.toolmanagingsystem.error.punch.PunchIdAlreadyExistedException;
import com.example.toolmanagingsystem.error.punch.PunchIdNotExistedException;
import com.example.toolmanagingsystem.error.user.NotAuthorizeRequestException;
import com.example.toolmanagingsystem.repository.*;
import com.example.toolmanagingsystem.repository.punch.PunchDeleteRepository;
import com.example.toolmanagingsystem.repository.punch.PunchRepository;
import com.example.toolmanagingsystem.service.userService.AdminApiService;
import com.example.toolmanagingsystem.service.userService.UserApiService;
import com.example.toolmanagingsystem.utils.FileHandling;
import com.example.toolmanagingsystem.vo.InspectionHistoryVO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Column;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.repository.query.Param;
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
    private final UserApiService userApiService;
    private final AdminApiService adminApiService;
    private final UserRepository userRepository;
    private final PunchDao dao;
    private final LoggingRepository loggingRepository;

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
            String supplierName = punchRegisterRequestDto.getSupplier();
            Supplier punchSupplier = this.returnSupplier(supplierName);

            String medicineName = punchRegisterRequestDto.getMedicine();
            Medicine medicine = this.returnMedicine(medicineName);
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
    public ApiResponse returnPunchList(@ModelAttribute PunchReturnRequestDto requestDto)
    {
        System.out.println("====================returnPunchList====================");
        System.out.println(requestDto);

        List<PunchWithInspectionDateResponseDto> punchListBeforeFilter = new ArrayList<>();

        if (requestDto.checkNull())
        {
            punchListBeforeFilter = this.punchRepository.findPunchWithInspectionDate();
            List<PunchWithInspectionDateResponseDto> punchListAfterFilter = this.filterPunchList(punchListBeforeFilter);
            return ApiResponse.success(punchListAfterFilter);
        }

        String supplierName = requestDto.getSupplier();
        Supplier supplier = this.returnSupplier(supplierName);

        String medicineName = requestDto.getMedicine();
        Medicine medicine = this.returnMedicine(medicineName);


        punchListBeforeFilter = this.punchRepository.findFilteredPunchWithInspectionDate(
                requestDto.getStatus(),
                requestDto.getPunchPosition(),
                requestDto.getMedicineType(),
                supplier,
                medicine,
                requestDto.getStartDate(),
                requestDto.getEndDate()
        );

        List<PunchWithInspectionDateResponseDto> punchListAfterFilter = this.filterPunchList(punchListBeforeFilter);
        return ApiResponse.success(punchListAfterFilter);
    }

    private List<PunchWithInspectionDateResponseDto> filterPunchList(List<PunchWithInspectionDateResponseDto> punchListBeforeFilter)
    {
        List<PunchWithInspectionDateResponseDto> punchList = new ArrayList<>();
        for (PunchWithInspectionDateResponseDto punch: punchListBeforeFilter)
        {
            if (punch.getPunchStatus() != PunchStatus.폐기)
            {
                punchList.add(punch);
            }
        }
        return punchList;
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
            this.validatePunch(punchId);

            Punch punch = this.punchRepository.findByPunchId(punchId);

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

    private Supplier returnSupplier(String supplierName)
    {
        return this.punchSupplierRepository.findBySupplier(supplierName);
    }

    private Medicine returnMedicine(String medicineName)
    {
        return this.medicineRepository.findByMedicine(medicineName);
    }

    private void validatePunch(String punchId)
    {
        Punch punch = this.punchRepository.findByPunchId(punchId);

        if (punch == null)
        {
            throw new PunchIdNotExistedException();
        }
    }

    @Transactional
    @PostMapping("/restorePunchFromDeleteHistory")
    public ApiResponse restorePunchFromDeleteHistory(@RequestBody PunchRestoreFromDeleteHistoryRequestDto punchRestoreFromDeleteHistoryRequestDto)
    {
        System.out.println("restorePunchFromDeleteHistory");
        System.out.println(punchRestoreFromDeleteHistoryRequestDto);

        String punchId = punchRestoreFromDeleteHistoryRequestDto.getPunch();
        this.validatePunch(punchId);

        String username = punchRestoreFromDeleteHistoryRequestDto.getUsername();

        this.userApiService.validateUser(username);
        User user = this.userRepository.findByUsername(username);

        this.adminApiService.checkUserAuthority(user, "restorePunch");

        Punch punch = this.punchRepository.findByPunchId(punchId);

        punch.setPunchStatus(PunchStatus.valueOf(punchRestoreFromDeleteHistoryRequestDto.getPreviousPunchStatus()));
        this.punchRepository.save(punch);
        this.punchDeleteRepository.deleteByPunch(punchId);

        List<PunchDelete> deleteHistory = this.punchDeleteRepository.findAll();

        Logging logging = new Logging(username, LoggingActivity.PUNCH_REACTIVATED_FROM_DELETE, "PunchId: " + punchId);
        this.loggingRepository.save(logging);

        System.out.println("deleteHistory=============================");
        System.out.println(deleteHistory);

        return ApiResponse.success(deleteHistory);
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

        String punchId = punchScrapRequestDao.getPunchId();

        Punch punch = this.punchRepository.findByPunchId(punchId);

        if (punch == null)
        {
            throw new PunchIdNotExistedException();
        }

        PunchStatus previousPunchStatus = punch.getPunchStatus();

        punch.setPunchStatus(PunchStatus.폐기);
        this.punchRepository.save(punch);

        Medicine medicine = punch.getMedicine();
        String reason = punchScrapRequestDao.getReason();

        PunchDelete punchDelete = new PunchDelete(punch.getPunchId(), medicine.getMedicine(), previousPunchStatus, reason, LocalDate.now());
        try
        {
            this.punchDeleteRepository.save(punchDelete);

            Logging logging = new Logging(punchScrapRequestDao.getUser(), LoggingActivity.PUNCH_SCRAP, "PunchId: " + punchId);
            this.loggingRepository.save(logging);
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
        String strFilePath = this.staticPath + "resources\\pdf\\inspection\\" + fileName;

        FileHandling.fileHandling(strFilePath, specificationFile);

        return strFilePath;
    }
}

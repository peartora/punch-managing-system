package com.example.toolmanagingsystem.controller;

import com.example.toolmanagingsystem.dao.PunchDao;
import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.*;
import com.example.toolmanagingsystem.dto.response.*;
import com.example.toolmanagingsystem.dto.response.myPageResponseDto.MyPageResponseDto;
import com.example.toolmanagingsystem.dto.response.myPageResponseDto.PageResponseDtoForAdmin;
import com.example.toolmanagingsystem.dto.response.myPageResponseDto.PageResponseDtoForNotAdmin;
import com.example.toolmanagingsystem.entity.*;
import com.example.toolmanagingsystem.entity.punch.Punch;
import com.example.toolmanagingsystem.entity.punch.PunchDelete;
import com.example.toolmanagingsystem.entity.punch.PunchStatus;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.error.BusinessError;
import com.example.toolmanagingsystem.repository.*;
import com.example.toolmanagingsystem.repository.punch.PunchDeleteRepository;
import com.example.toolmanagingsystem.repository.punch.PunchRepository;
import com.example.toolmanagingsystem.service.userService.UserService;
import com.example.toolmanagingsystem.service.userService.exception.DuplicatedUsernameException;
import com.example.toolmanagingsystem.service.userService.exception.PasswordLengthIsNotEnoughException;
import com.example.toolmanagingsystem.service.userService.exception.PasswordNotSameException;
import com.example.toolmanagingsystem.vo.InspectionHistoryVO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/tool-managing-system")
@RequiredArgsConstructor
public class ApiController
{
//    private final Logger logger;

    private final PunchRepository punchRepository;
    private final MedicineRepository medicineRepository;
    private final SupplierRepository punchSupplierRepository;
    private final UserRepository userRepository;
    private final PunchDeleteRepository punchDeleteRepository;
    private final InsepctionRepository inspectionRepository;
    private final UserService userService;
    private final PunchDao dao;

    @ExceptionHandler(BusinessError.class)
    public ApiResponse handleBusinessError(BusinessError error)
    {
        return ApiResponse.error(error);
    }

    @Value("${TOOL_MANAGING_SYSTEM_STATIC_PATH}")
    private String staticPath;


    @PostMapping("/register")
    public PunchRegisterResponseDto registerPunch(@RequestBody List<PunchRegisterRequestDto> punchRegisterRequestDtoList)
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

        try
        {
            this.punchRepository.saveAll(entityList);
            return new PunchRegisterResponseDto(entityList.size(), "OK");
        }
        catch (Exception e)
        {
            return new PunchRegisterResponseDto(0, "NOK");
        }
    }

    @GetMapping("/display")
    public List<Punch> returnPunchList(@RequestParam HashMap<String, Object> params) // 단일 값을 받던지, 다수를 받으려면 Map;
    {
        System.out.println("params");
        System.out.println(params);

        List<Punch> punchList = new ArrayList<>();
        List<Punch> filteredPunchList = new ArrayList<>();

        Iterable<Punch> punchIterable = this.punchRepository.findAll();
        for (Punch punch: punchIterable)
        {
            punchList.add(punch);
        }

        if (params.isEmpty()) {
            return punchList;
        } else {
            for (Punch punch: punchList)
            {
                if (this.filterPunch(punch, params)) {
                    filteredPunchList.add(punch);
                }
            }
            return filteredPunchList;
        }
    }

    @GetMapping("/duplicate")
    public int returnCheckResult(@RequestParam String punchId)
    {
        int count = this.dao.checkDuplicate(punchId);

        return count;
    }

    @PostMapping("/updateStatus")
    public PunchStatusUpdateResponseDto updateNewStatus(@RequestBody List<PunchStatusUpdateRequestDto> punchStatusUpdateRequestDtoList)
    {
        System.out.println("updateNewStatus");

        List<Punch> punchList = new ArrayList<>();

        for (PunchStatusUpdateRequestDto punchStatusUpdateRequestDto : punchStatusUpdateRequestDtoList)
        {
            System.out.println("punchStatusUpdateRequestDto");
            System.out.println(punchStatusUpdateRequestDto);

            String punchId = punchStatusUpdateRequestDto.getPunchId();
            Punch punch = this.punchRepository.findByPunchId(punchId);
            punch.setPunchStatus(PunchStatus.valueOf(punchStatusUpdateRequestDto.getNewStatus()));
            punchList.add(punch);
        }
        try
        {
            System.out.println("ok");
            this.punchRepository.saveAll(punchList);
            PunchStatusUpdateResponseDto punchStatusUpdateResponseDto = new PunchStatusUpdateResponseDto(
                    punchList.size(), punchList.get(0).getPunchStatus().toString(), "OK"
            );
            return punchStatusUpdateResponseDto;
        }
        catch (Exception e)
        {
            System.out.println("nok");
            PunchStatusUpdateResponseDto punchStatusUpdateResponseDto = new PunchStatusUpdateResponseDto(
                    0, punchList.get(0).getPunchStatus().toString(), "NOK"
            );
            return punchStatusUpdateResponseDto;
        }
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
    public void scrapPunch(@RequestBody PunchScrapRequestDao punchScrapRequestDao)
    {
        System.out.println("scrapPunch");
        System.out.println(punchScrapRequestDao);

        Punch punch = this.punchRepository.findByPunchId(punchScrapRequestDao.getPunchId());
        punch.setPunchStatus(PunchStatus.폐기);
        this.punchRepository.save(punch);

        Medicine medicine = punch.getMedicine();
        PunchStatus previousStatus = punch.getPunchStatus();
        String reason = punchScrapRequestDao.getReason();

        PunchDelete punchDelete = new PunchDelete(punch.getPunchId(), medicine.getMedicine(), previousStatus, reason, LocalDate.now());
        this.punchDeleteRepository.save(punchDelete);
    }

    @PostMapping("/addCleanHistory")
    public void addCleanHistory(@RequestBody HashMap<String, Object> params)
    {
        System.out.println("params");
        System.out.println(params);

        this.dao.addCleanHistory(params);
    }

    @GetMapping("/getCleanHistory")
    public List<Map<String, Object>> retrieveHistory(@RequestParam String punchId)
    {
        System.out.println("getCleanHistory");
        System.out.println(punchId);

        return this.dao.retrievCleanHistory(punchId);
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

    @PostMapping("/updateBatchInfor")
    public int updateBatchSize(
            @RequestParam(value = "product") String productName,
            @RequestParam(value = "specificationFile", required = false) MultipartFile specificationFile
    )
    {
        String strFilePath = saveSpecificationFile(specificationFile);

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

    @GetMapping("/duplicateMedicine")
    public String returnCheckResultForMedicine(@RequestParam String medicineName)
    {
        Medicine medicine = this.medicineRepository.findByMedicine(medicineName);
        if (medicine == null)
        {
            return "OK";
        }
        else
        {
            return "NOK";
        }
    }

    @PostMapping("/registerMedicine")
    public String registerMedicine(@RequestParam("medicine") String medicineName, @RequestParam("specificationFile") MultipartFile specificationFile)
    {
        String strFilePath = this.saveSpecificationFile(specificationFile);
        Medicine medicine = new Medicine(medicineName, LocalDateTime.now(), strFilePath);

        try
        {
            this.medicineRepository.save(medicine);
            return "OK";
        }
        catch (Exception e)
        {
            return "NOK";
        }
    }

    @Transactional
    @PostMapping("updateInspectionResultAndStatus")
    public void updateInspectionResult(MultipartHttpServletRequest params) throws JsonProcessingException
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
            punch.setPunchStatus(PunchStatus.사용가능);
            punchList.add(punch);
        }

        this.inspectionRepository.saveAll(inspectionList);
        this.punchRepository.saveAll(punchList);
    }

    @PostMapping("/addSupplier")
    public int addSupplier(@RequestBody Supplier supplier)
    {
        System.out.println("addSupplier");
        System.out.println(supplier.getSupplier());

        try
        {
            this.punchSupplierRepository.save(supplier);
            return 1;
        }
        catch (Exception e)
        {
            return 0;
        }
    }

    @GetMapping("/duplicateSupplier")
    public int returnCheckResultForSupplier(@RequestParam String supplier)
    {
        return this.dao.checkDuplicateSupplier(supplier);
    }

    @GetMapping("/getSuppliers")
    public List<String> returnSuppliers()
    {
        return this.dao.returnSuppliers();
    }

    @GetMapping("/display-scrapped")
    public List<PunchDelete> returnScrappedPunchList(@RequestParam Map<String, Object> params)
    {
        System.out.println("returnScrappedPunchList");
        System.out.println(params);

        List<PunchDelete> punchDeleteList = this.punchDeleteRepository.findAll();

        System.out.println(punchDeleteList);

        return punchDeleteList;
//        return dao.getScrappedPunchList(params);
    }

    @PostMapping("/login")
    public LoginResponseDto login (@RequestBody LoginRequestDto requestDto)
    {
        return this.userService.login(requestDto);
    }

    @PostMapping("/password_change")
    public PasswordChangeResponseDto changePassword (@RequestBody PasswordChangeRequestDto requestDto)
    {
        System.out.println("changePassword");
        System.out.println(requestDto);

        String username = requestDto.getUsername();
        User user = this.userRepository.findByUsername(username);

        PasswordChangeResponseDto responseDto = new PasswordChangeResponseDto(username);

        if (Objects.equals(user.getPassword(), requestDto.getNewPassword()))
        {
            responseDto.setPasswordChanged(false);
            responseDto.setNewPasswordDifferentWithCurrentPassword(false);
            return responseDto;
        }
        else
        {
            responseDto.setNewPasswordDifferentWithCurrentPassword(true);
        }

        if (!Objects.equals(requestDto.getNewPassword(), requestDto.getNewPasswordForConfirmation()))
        {
            responseDto.setPasswordChanged(false);
            responseDto.setNewPasswordSameWithNewPasswordConfirmation(false);
            return responseDto;
        }
        else
        {
            responseDto.setNewPasswordSameWithNewPasswordConfirmation(true);
        }


        if (requestDto.getNewPassword().length() < 6)
        {
            responseDto.setPasswordChanged(false);
            responseDto.setNewPasswordLonghEnough(false);
            return responseDto;
        }
        else
        {
            responseDto.setNewPasswordLonghEnough(true);
        }

        responseDto.setPasswordChanged(true);
        user.setPassword(requestDto.getNewPassword());
        user.setPasswordSetDate(LocalDate.now());
        this.userRepository.save(user);
        return responseDto;
    }

    @PostMapping("/register_user")
    public UserRegisterResponseDto registerUser (@RequestBody @Valid UserRegisterRequestDto requestDto)
    {
//        logger.debug("registerUser");
//        logger.debug("%o", requestDto);

        this.userService.registerUser(requestDto);

        return new UserRegisterResponseDto(requestDto.getUsername());
    }

    @PostMapping("/duplicate_username")
    public String returnCheckResultForUsername(@RequestBody Map<String, Object> params)
    {
        System.out.println("returnCheckResultForUsername");
        System.out.println(params);

        User user = this.userRepository.findByUsername((String) params.get("id"));

        if (user == null)
        {
            return "OK";
        } else
        {
            return "NOK";
        }
    }

    @GetMapping("/created-date")
    public String returnCreatedDate(@RequestParam Map<String, Object> params)
    {
        System.out.println("returnCreatedDate");
        System.out.println(params);

        return dao.returnCreatedDate(params);
    }

    @PostMapping("/authority")
    public String returnAuthority(@RequestBody Map<String, Object> params)
    {
        System.out.println("returnAuthority");
        System.out.println(params);

        User user = this.userRepository.findByUsername(params.get("username").toString());
        return user.getUserRole().toString();
    }

    @PostMapping("/my_page")
    public MyPageResponseDto createMyPage(@RequestBody MyPageRequestDto requestDto)
    {
        System.out.println("createMyPage");
        System.out.println(requestDto);

        User user = this.userRepository.findByUsername(requestDto.getUsername());


        if (Objects.equals(user.getUserRole().toString(), "ADMIN"))
        {
            PageResponseDtoForAdmin responseDto = new PageResponseDtoForAdmin(user.getUsername());
            responseDto.setAdmin(true);
            Iterable<User> userIterable = this.userRepository.findAll();

            responseDto.setUserList(userIterable);

            return responseDto;
        }
        else
        {
            LocalDate passwordSetDate = user.getPasswordSetDate();
            PageResponseDtoForNotAdmin responseDto = new PageResponseDtoForNotAdmin(user.getUsername());
            responseDto.setAdmin(false);

            responseDto.setPasswordSetDate(user.getPasswordSetDate());
            responseDto.setUserRole(user.getUserRole());
            responseDto.setPasswordValidUntil(passwordSetDate.plusMonths(6));

            return responseDto;
        }
    }

    @GetMapping("/idList")
    public List<Map<String, Object>> returnIdList()
    {
        System.out.println("returnIdList");

        List<Map<String, Object>> idList = new ArrayList<>();
        Iterable<User> userIterableList = this.userRepository.findAll();

        for (User user: userIterableList)
        {
            Map<String, Object> idMap = new HashMap<>();
            idMap.put("username", user.getUsername());
            idMap.put("is_not_locked", user.isNotLocked());
            idMap.put("is_approved", user.isApproved());
            idMap.put("role", user.getUserRole());
            idList.add(idMap);
        }

        return idList;
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

    @PostMapping("/approveId")
    public String approveId(@RequestBody Map<String, Object> params)
    {
        System.out.println("approveId");
        System.out.println(params);

        User user = this.userRepository.findByUsername(params.get("username").toString());
        user.setApproved(true);
        user.setNotExpired(true);
        user.setNotLocked(true);
        try
        {
            this.userRepository.save(user);
            return "OK";
        }
        catch (Exception e)
        {
            return "NOK";
        }
    }

    @PostMapping("/resetPassword")
    public ResetPasswordResponseDto resetPassword(@RequestBody ResetPasswordRequestDto requestDto)
    {
        System.out.println("resetPassword");
        System.out.println(requestDto);

        User user = this.userRepository.findByUsername(requestDto.getUsername());
        String currentPassword = user.getPassword();

        ResetPasswordResponseDto responseDto = new ResetPasswordResponseDto(requestDto.getUsername());

        if (currentPassword.equals(requestDto.getPassword()))
        {
            responseDto.setPasswordSameWithCurrentPassword(true);
            return responseDto;
        }
        else
        {
            responseDto.setPasswordSameWithCurrentPassword(false);
        }

        if (requestDto.getPassword().length() < 6)
        {
            responseDto.setPasswordLongEnough(false);
            return responseDto;
        }
        else
        {
            responseDto.setPasswordLongEnough(true);
        }

        responseDto.setPasswordReset(true);
        user.setPassword(requestDto.getPassword());
        user.setPasswordSetDate(LocalDate.now());
        user.setTrialCount(0);
        this.userRepository.save(user);

        return responseDto;
    }

    @PostMapping("/delete_user")
    public String deleteUser(@RequestBody Map<String, Object> params)
    {
        System.out.println("deleteUser");
        System.out.println(params);

        User user = this.userRepository.findByUsername(params.get("username").toString());
        try
        {
            this.userRepository.delete(user);
            return "OK";
        }
        catch (Exception e)
        {
            return "NOK";
        }
    }

    private String saveSpecificationFile(MultipartFile specificationFile)
    {
        String fileName = specificationFile.getOriginalFilename();
        // String strFilePath = "C:\\Users\\lsm1dae\\Desktop\\specifications\\" + fileName;
        String strFilePath = this.staticPath + "resources\\pdf\\specification\\" + fileName;


        fileHandling(strFilePath, specificationFile);

        return strFilePath;
    }

    private String saveInspectionFile(MultipartFile specificationFile)
    {
        String fileName = specificationFile.getOriginalFilename();
        // String strFilePath = "C:\\Users\\lsm1dae\\Desktop\\inspection\\" + fileName;
        String strFilePath = this.staticPath + "resources\\pdf\\inspection\\" + fileName;

        fileHandling(strFilePath, specificationFile);

        return strFilePath;
    }
    private void fileHandling(String strFilePath, MultipartFile specificationFile)
    {
        try
        {
            byte[] fileBytes = specificationFile.getBytes();
            Path filePath = Paths.get(strFilePath);
            Files.write(filePath, fileBytes);
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
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


        if (!Objects.equals(punch.getStorageLocation(), storageLocation))
        {
            return false;
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

package com.example.toolmanagingsystem.controller;

import com.example.toolmanagingsystem.dao.PunchDao;
import com.example.toolmanagingsystem.dto.request.PunchRegisterRequestDto;
import com.example.toolmanagingsystem.dto.request.PunchScrapDao;
import com.example.toolmanagingsystem.dto.request.UserRegisterDto;
import com.example.toolmanagingsystem.dto.response.PunchRegisterResponseDto;
import com.example.toolmanagingsystem.entity.*;
import com.example.toolmanagingsystem.entity.logging.Logging;
import com.example.toolmanagingsystem.entity.logging.LoggingActivity;
import com.example.toolmanagingsystem.entity.punch.Punch;
import com.example.toolmanagingsystem.entity.punch.PunchStatus;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.repository.*;
import com.example.toolmanagingsystem.vo.InspectionHistoryVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/tool-managing-system")
@RequiredArgsConstructor
public class ApiController
{
    @Autowired
    PunchRepository punchRepository;
    @Autowired
    MedicineRepository medicineRepository;
    @Autowired
    PunchSupplierRepository punchSupplierRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    LoggingRepository loggingRepository;

    @Value("${TOOL_MANAGING_SYSTEM_STATIC_PATH}")
    private String staticPath;

    private final PunchDao dao;
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

            Punch entity = new Punch(punchRegisterRequestDto, punchSupplier, medicine);
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
    public List<Punch> returnPunchList(@RequestParam HashMap<String, Object> params)
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
    public void updateNewStatus(@RequestBody Map<String, Object> params)
    {
        System.out.println("params as Map");
        System.out.println(params);
        System.out.println(params.get("rows"));

        if (params.get("rows") == null)
        {
            System.out.println("rows is null");
            this.dao.updateNewStatus(params);
        }
        else
        {
            List<HashMap<String, Object>> rows = (List<HashMap<String, Object>>) params.get("rows");

            for (HashMap<String, Object> mapParams: rows)
            {
                this.dao.updateNewStatus(mapParams);
            }
        }
    }

    @PostMapping("/recover")
    public int recoverPunchFromDeleteStatus(@RequestBody Map<String, Object> params)
    {
        System.out.println("recoverPunchFromDeleteStatus");
        System.out.println(params);
        System.out.println("params");

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

    @PostMapping("/updateStatus/scrap")
    public void scrapPunch(@RequestBody PunchScrapDao punchScrapDao)
    {
        System.out.println("/updateStatus/scrap");
        System.out.println(punchScrapDao);
        this.dao.deletePunch(punchScrapDao);
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
    @PostMapping("updateInspectionResult")
    public void updateInspectionResult(MultipartHttpServletRequest params)
    {
        Map<String, MultipartFile> fileMap = params.getFileMap();
        String filePath = saveInspectionFile(fileMap.get("inspectionResultPdfFile"));

        Map<String, String[]> parameterMap = params.getParameterMap();

        for (String key: parameterMap.keySet())
        {
            Map<String, Object> mapParamsWithPdfFilePath = new HashMap<String, Object>();

            String[] punchIdArrays = parameterMap.get(key);
            for(int i = 0; i < punchIdArrays.length; i++)
            {
                mapParamsWithPdfFilePath.put("punchId", punchIdArrays[i]);
                mapParamsWithPdfFilePath.put("filePath", filePath);

                this.dao.updateInspectionResult(mapParamsWithPdfFilePath);
            }
        }
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
    public List<Map<String, Object>> returnScrappedPunchList(@RequestParam Map<String, Object> params)
    {
        System.out.println("returnScrappedPunchList");
        System.out.println(params);

        return dao.getScrappedPunchList(params);
    }

    @PostMapping("/usercheck")
    public String checkUserId (@RequestBody Map<String, Object> params)
    {
        System.out.println("checkUserId");
        System.out.println(params);

        User user = this.userRepository.findByUsername(params.get("username").toString());
        if (user == null)
        {
            this.logging("unknown", LoggingActivity.LOGIN_FAIL_PASSWORD_UNREGISTERED_ID);
            System.out.println("NoId");
            return "NoId";
        }
        // User entity, Teacher entity

        String username = user.getUsername();
        boolean isApproved = user.isApproved();
        boolean isLocked = user.isLocked();
        String currentPassword = user.getPassword();
        int trialCount = user.getTrialCount();
        LocalDate createdDate = user.getCreatedDate();

        this.logging(username, LoggingActivity.LOGIN_TRIAL);

        if (!isApproved)
        {
            this.logging(username, LoggingActivity.LOGIN_FAIL_NOT_APPROVED_ID);
            System.out.println("NotYetApproved");
            return ("NotYetApproved");
        }
        else // approved
        {
            if (isLocked)
            {
                this.logging(username, LoggingActivity.LOGIN_FAIL_LOCKED_ID);
                System.out.println("Locked");
                return "Locked";
            }
            else // unlocked
            {
                if (LocalDate.now().isAfter(createdDate.plusMonths(6)))
                {
                    this.logging(username, LoggingActivity.LOGIN_FAIL_PASSWORD_EXPIRED);
                    System.out.println("password is expired");
                    return "Expired";
                }
                else // password is not expired
                {
                    if (Objects.equals(params.get("password"), currentPassword))
                    {
                        this.logging(username, LoggingActivity.LOGIN);
                        user.setTrialCount(0);
                        this.userRepository.save(user);
                        System.out.println("LOGINED AS " + username);
                        return "OK";
                    }
                    else // password is not correct
                    {
                        this.logging(username, LoggingActivity.LOGIN_FAIL_PASSWORD_INCORRECT);
                        int trialCountPlusOne = trialCount + 1;
                        user.setTrialCount(trialCountPlusOne);
                        this.userRepository.save(user);

                        if (trialCountPlusOne >= 5)
                        {
                            user.setLocked(true);
                            this.userRepository.save(user);
                            System.out.println("It`s newly locked");
                            return "Locked";
                        }
                        else
                        {
                            System.out.println("password is wrong," + trialCountPlusOne);
                            return "NOK," + trialCountPlusOne;
                        }
                    }
                }
            }
        }
    }

    @PostMapping("/password_change")
    public String changePassword (@RequestBody Map<String, Object> params)
    {
        System.out.println("changePassword");
        System.out.println(params);

        String username = params.get("username").toString();
        User user = this.userRepository.findByUsername(username);
        user.setPassword(params.get("newPassword").toString());

        try
        {
            this.userRepository.save(user);
            this.logging(username, LoggingActivity.PASSWORD_CHANGE);
            return "OK";
        }
        catch (Exception e)
        {
            return "NOK";
        }
    }

    @PostMapping("/create_id")
    public String registerUser (@RequestBody UserRegisterDto userRegisterDto)
    {
        System.out.println("registerUser");
        System.out.println(userRegisterDto);

        User user = new User(userRegisterDto);
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

    @PostMapping("/duplicate_username")
    public String returnCheckResultForUsername(@RequestBody Map<String, Object> params)
    {
        System.out.println("returnCheckResultForUsername");
        System.out.println(params);

        String username = (String) params.get("id");
        int count = this.userRepository.countByUsername(username);

        if (count == 0)
        {
            return "OK";
        }
        else
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
            idMap.put("is_locked", user.isLocked());
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
    public String resetPassword(@RequestBody Map<String, Object> params)
    {
        System.out.println("resetPassword");
        System.out.println(params);

        User user = this.userRepository.findByUsername(params.get("username").toString());
        String currentPassword = user.getPassword();

        if (currentPassword.equals(params.get("password"))) {
            System.out.println("NOK_PasswordSame");
            return "NOK_PasswordSame";
        }

        user.setPassword(params.get("password").toString());
        user.setLocked(false);

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

    private void logging(String username, LoggingActivity activity)
    {
        Logging logging = new Logging(username, activity, LocalDateTime.now());
        this.loggingRepository.save(logging);
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

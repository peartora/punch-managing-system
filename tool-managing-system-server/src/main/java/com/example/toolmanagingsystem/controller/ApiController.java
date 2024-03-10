package com.example.toolmanagingsystem.controller;

import com.example.toolmanagingsystem.dao.PunchDao;
import com.example.toolmanagingsystem.dto.*;
import com.example.toolmanagingsystem.entity.*;
import com.example.toolmanagingsystem.entity.Punch;
import com.example.toolmanagingsystem.repository.*;
import com.example.toolmanagingsystem.vo.InspectionHistoryVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.EmptyResultDataAccessException;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tool-managing-system")
@RequiredArgsConstructor
public class ApiController
{
    @Autowired
    PunchRepository punchRepository;
    @Autowired
    ProductRepository productRepository;
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
    public int registerPunch(@RequestBody List<PunchRegister> punchRegisterList)
    {
        System.out.println("registerPunch");

        List<Punch> punchList = new ArrayList<>();

        for (PunchRegister punch: punchRegisterList)
        {
            String supplier = punch.getManufacturer();
            PunchSupplier punchSupplier = this.punchSupplierRepository.findBySupplier(supplier);

            String productName = punch.getProduct();
            Product product = this.productRepository.findByProduct(productName);

            Punch punchEntity = new Punch(punch, punchSupplier, product);
            punchList.add(punchEntity);
        }

        int count = 0;

        try
        {
            Iterable<Punch> punchIterable = this.punchRepository.saveAll(punchList);
            for (Punch punch: punchIterable)
            {
                count++;
            }
        }
        catch (Exception e)
        {
            return 0;
        }

        return count;
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

    @GetMapping("/getProducts")
    public List<String> returnProducts()
    {
        return this.dao.returnProducts();
    }

    @PostMapping("/updateBatchInfor")
    public int updateBatchSize(
            @RequestParam(value = "product") String productName,
            @RequestParam(value = "specificationFile", required = false) MultipartFile specificationFile
    )
    {
        String strFilePath = saveSpecificationFile(specificationFile);

        Product productBeforeUpdate = this.productRepository.findByProduct(productName);
        productBeforeUpdate.setSpecificationPath(strFilePath);

        try
        {
            this.productRepository.save(productBeforeUpdate);
            return 1;
        }
        catch (Exception e)
        {
            return 0;
        }
    }

    @GetMapping("/duplicateProduct")
    public int returnCheckResultForProduct(@RequestParam String product)
    {
        return this.dao.checkDuplicateForProduct(product);
    }

    @PostMapping("/addProduct")
    public int addProduct(@RequestParam("product") String productName, @RequestParam("specificationFile") MultipartFile specificationFile)
    {
        String strFilePath = this.saveSpecificationFile(specificationFile);
        Product product = new Product(productName, LocalDateTime.now(), strFilePath);

        try
        {
            this.productRepository.save(product);
            return 1;
        }
        catch (Exception e)
        {
            return 0;
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
    public int addSupplier(@RequestBody PunchSupplier punchSupplier)
    {
        System.out.println("addSupplier");
        System.out.println(punchSupplier.getSupplier());

        try
        {
            this.punchSupplierRepository.save(punchSupplier);
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
            this.logging("unknown", LogActivity.LOGIN_FAIL_PASSWORD_UNREGISTERED_ID);
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

        this.logging(username, LogActivity.LOGIN_TRIAL);

        if (!isApproved)
        {
            this.logging(username, LogActivity.LOGIN_FAIL_NOT_APPROVED_ID);
            System.out.println("NotYetApproved");
            return ("NotYetApproved");
        }
        else // approved
        {
            if (isLocked)
            {
                this.logging(username, LogActivity.LOGIN_FAIL_LOCKED_ID);
                System.out.println("Locked");
                return "Locked";
            }
            else // unlocked
            {
                if (LocalDate.now().isAfter(createdDate.plusMonths(6)))
                {
                    this.logging(username, LogActivity.LOGIN_FAIL_PASSWORD_EXPIRED);
                    System.out.println("password is expired");
                    return "Expired";
                }
                else // password is not expired
                {
                    if (Objects.equals(params.get("password"), currentPassword))
                    {
                        this.logging(username, LogActivity.LOGIN);
                        user.setTrialCount(0);
                        this.userRepository.save(user);
                        System.out.println("LOGINED AS " + username);
                        return "OK";
                    }
                    else // password is not correct
                    {
                        this.logging(username, LogActivity.LOGIN_FAIL_PASSWORD_INCORRECT);
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
            this.logging(username, LogActivity.PASSWORD_CHANGE);
            return "OK";
        }
        catch (Exception e)
        {
            return "NOK";
        }
    }

    @PostMapping("/create_id")
    public String createId (@RequestBody UserDto userDto)
    {
        System.out.println("createId");
        System.out.println(userDto);

        User user = new User(userDto);
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

    private void logging(String username, LogActivity activity)
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

        String type = (String) params.get("type");
        System.out.println("type:");
        System.out.println(type);

        String manufacturer = (String) params.get("manufacturer");
        System.out.println("manufacturer:");
        System.out.println(manufacturer);

        String strStatus = (String) params.get("status");
        System.out.println("strStatus:");
        System.out.println(strStatus);

        PunchStatus status = null;

        if (!Objects.equals(strStatus, "All")) {
            status = PunchStatus.valueOf(strStatus);
            System.out.println("status:");
            System.out.println(status);
        }

        String storageLocation = (String) params.get("storageLocation");
        System.out.println("storageLocation:");
        System.out.println(storageLocation);

        String product = (String) params.get("product");
        System.out.println("product:");
        System.out.println(product);

        String pType = (String) params.get("ptype");
        System.out.println("pType:");
        System.out.println(pType);

        System.out.println("===========================================================");

        if (punch.getRegisterDate().isBefore(startDate) || punch.getRegisterDate().isAfter(endDate))
        {
            return false;
        }

        if (!Objects.equals(type, "All"))
        {
            if (!Objects.equals(punch.getType(), type))
            {
                return false;
            }
        }

        if (!Objects.equals(manufacturer, "All"))
        {
            if (!Objects.equals(punch.getSupplier().getSupplier(), manufacturer))
            {
                return false;
            }
        }

        if (!Objects.equals(strStatus, "All"))
        {
            if (!Objects.equals(punch.getPunchStatus().toString(), status.toString()))
            {
                return false;
            }
        }


        if (!Objects.equals(punch.getPunchStorageLocation(), storageLocation))
        {
            return false;
        }

        if (!Objects.equals(product, "All"))
        {
            if (!Objects.equals(punch.getProductType().getProduct(), product))
            {
                return false;
            }
        }

        if (!Objects.equals(pType, "All"))
        {
            if (!Objects.equals(punch.getPtype(), pType))
            {
                return false;
            }
        }

        return true;
    }
}

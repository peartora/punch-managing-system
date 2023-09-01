package com.example.toolmanagingsystem.controller;

import com.example.toolmanagingsystem.dao.PunchDao;
import com.example.toolmanagingsystem.dto.PunchRegister;
import com.example.toolmanagingsystem.dto.PunchScrapDao;
import com.example.toolmanagingsystem.vo.InspectionHistoryVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/tool-managing-system")
@RequiredArgsConstructor
public class ApiController
{
    @Value("${TOOL_MANAGING_SYSTEM_STATIC_PATH}")
    private String staticPath;

    private final PunchDao dao;
    @PostMapping("/register")
    public int[] registerPunch(@RequestBody List<PunchRegister> punchIdArrays)
    {
        System.out.println("registerPunch");
        System.out.println(punchIdArrays);

        for (PunchRegister data : punchIdArrays) {
            System.out.println(data.getDate());
        }

        return this.dao.registerPunch(punchIdArrays);
    }

    @GetMapping("/display")
    public List<HashMap<String, Object>> returnPunchList(@RequestParam Map<String, Object> params)
    {
        System.out.println("params");
        System.out.println(params);

        return this.dao.getUsingPunchList(params);
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
        HashMap<String, Object> mapParams = new HashMap<>();

        String strFilePath = saveSpecificationFile(specificationFile);

        mapParams.put("product", productName);
        mapParams.put("specificationFilePath", strFilePath);

        return this.dao.updateSizeInformation(mapParams);
    }

    @GetMapping("/duplicateProduct")
    public int returnCheckResultForProduct(@RequestParam String product)
    {
        return this.dao.checkDuplicateForProduct(product);
    }

    @PostMapping("/addProduct")
    public int addProduct(
            @RequestParam("product") String productName,
            @RequestParam("specificationFile") MultipartFile specificationFile
    )
    {
        String strFilePath = saveSpecificationFile(specificationFile);

        HashMap<String, Object> mapParams = new HashMap<>();
        mapParams.put("product", productName);
        mapParams.put("specificationFilePath", strFilePath);

        return this.dao.addProduct(mapParams);
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
    public int addSupplier(@RequestBody HashMap<String, Object> params)
    {
        return this.dao.addSupplier(params);
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

        boolean isLocked = this.dao.getLockStatus(params);

        if (isLocked)
        {
            return "Locked";
        }
        else
        {
            String returnedPassword = "";

            try
            {
                returnedPassword = this.dao.checkUserIdAndPassword(params);
            }
            catch (EmptyResultDataAccessException e)
            {
                return "NoId";
            }

            if (Objects.equals(params.get("password"), returnedPassword))
            {
                params.put("trialCount", 0);
                this.dao.changeTrialCount(params);

                return "OK";
            }
            else
            {
                int trialCount = this.dao.getTrialCount(params);
                int trialCountPlusOne = trialCount + 1;
                params.put("trialCount", trialCountPlusOne);

                this.dao.changeTrialCount(params);

                if (trialCountPlusOne >= 5)
                {
                    params.put("lockStatus", true);
                    this.dao.lockId(params);

                    return "Locked";
                }
                else
                {
                    return "NOK";
                }
            }
        }
    }

    @PostMapping("/password_change")
    public String changePassword (@RequestBody Map<String, Object> params)
    {
        System.out.println("changePassword");
        System.out.println(params);

        System.out.println(dao.checkUserIdAndPassword(params));
        int effectedRow = dao.changePassword(params);

        if (effectedRow == 1)
        {
            return "OK";
        }
        else
        {
            return "NOK";
        }
    }

    @PostMapping("/create_id")
    public String createId (@RequestBody Map<String, Object> params)
    {
        System.out.println("createId");
        System.out.println(params);

        int effectedRow = dao.createId(params);

        if (effectedRow == 1)
        {
            return "OK";
        }
        else
        {
            return "NOK";
        }
    }

    @PostMapping("/duplicate_username")
    public String returnCheckResultForUsername(@RequestBody Map<String, Object> params)
    {
        System.out.println("returnCheckResultForUsername");
        System.out.println(params);

        int count = this.dao.checkDuplicateId(params);

        if (count == 0)
        {
            return "OK";
        }
        else
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
}

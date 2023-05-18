package com.example.toolmanagingsystem.controller;

import com.example.toolmanagingsystem.dao.PunchDao;
import com.example.toolmanagingsystem.dto.PunchScrapDao;
import com.example.toolmanagingsystem.dto.Punch;
import com.example.toolmanagingsystem.error.DuplicatedIdError;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tool-managing-system")
@RequiredArgsConstructor
public class ApiController
{
    private final PunchDao dao;

    @PostMapping("/register")
    public String registerPunch(@RequestBody Punch punch)
    {
        System.out.println(punch);

        int numberOfAffectedRows = this.dao.registerPunch(punch);

        if (numberOfAffectedRows == 1)
        {
            return "펀치 ID :" + punch.getNumber() + " 가 정상적으로 등록 되었습니다.";
        }
        return "등록 요청이 정상적으로 처리 되지 않았습니다.";
    }

    @PostMapping("/updateUsageNumber")
    public void updateUsageNumber(@RequestBody HashMap<String, Object> number)
    {
//        System.out.println("number");
//        System.out.println(number);
         this.dao.updateUsageNumber(number);
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
        System.out.println("punchId");
        System.out.println(punchId);

        int count = this.dao.checkDuplicate(punchId);

        return count;
    }

    @PostMapping("/updateStatus")
    public void updateNewStatus(@RequestBody Map<String, Object> params)
    {
        System.out.println("updateNewStatus");
        System.out.println(params);

        this.dao.updateNewStatus(params);
    }

    @PostMapping("/updateStatus/scrap")
    public void scrapPunch(@RequestBody PunchScrapDao punchScrapDao)
    {
        System.out.println("punchScrapDao");
        System.out.println(punchScrapDao.getNumber());
        System.out.println(punchScrapDao.getNewStatus());
        System.out.println(punchScrapDao.getReason());

        this.dao.deletePunch(punchScrapDao);
    }

    @PostMapping("/addCleanHistory")
    public void addCleanHistory(@RequestBody HashMap<String, Object> number)
    {
        System.out.println("number");
        System.out.println(number);

        this.dao.addCleanHistory(number);
    }

    @PostMapping("/uploadFile")
    public String uploadPdfFile(@RequestParam("file") MultipartFile file,
                                @RequestParam("number") String number)
    {
        String fileName = file.getOriginalFilename();
        String strFilePath = "C:\\Users\\peart\\Desktop\\files\\" + fileName;
        try
        {
            byte[] fileBytes = file.getBytes();
            Path filePath = Paths.get(strFilePath);
            Files.write(filePath, fileBytes);
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }

        int numberOfAffectedRows = this.dao.addInvestigationHistory(number, strFilePath);

        if (numberOfAffectedRows == 1)
        {
            return "펀치 ID :" + number + "의 검수기록이 정상적으로 등록 되었습니다.";
        }

        return "검수기록 등록이 정상적으로 처리 되지 않았습니다.";
    }

    @PostMapping("/resetCount")
    public int resetCount(@RequestBody String number)
    {
        return this.dao.resetCountZero(number);
    }

    @GetMapping("/getCleanHistory")
    public List<Map<String, Object>> retrieveHistory(@RequestParam String number)
    {
        return this.dao.retrievCleanHistory(number);
    }

    @GetMapping("/getInspectionHistory")
    public List<Map<String, Object>> retrieveInspectionHistory(@RequestParam String number)
    {
        return this.dao.retrievInspectionHistory(number);
    }

    @GetMapping("/getProducts")
    public List<String> returnProducts()
    {
        return this.dao.returnProducts();
    }

    @PostMapping("/updateBatchInfor")
    public String updateBatchSize(
            @RequestParam("product") String productName,
            @RequestParam("batchSize") String batchSize,
            @RequestParam("inspectionSize") String inspectionSize,
            @RequestParam("specificationFile") MultipartFile specificationFile
    )
    {
        System.out.println("I`m inside of update product controller"); // confirmed.

        String fileName = specificationFile.getOriginalFilename();
        String strFilePath = "C:\\Users\\lsm1dae\\Desktop\\specifications\\" + fileName;
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

        HashMap<String, Object> mapParams = new HashMap<>();
        mapParams.put("product", productName);
        mapParams.put("newBatchSize", batchSize);
        mapParams.put("newInspectionSize", inspectionSize);
        mapParams.put("newSpecificationFilePath", strFilePath);

        System.out.println("mapParams");
        System.out.println(mapParams);


        int numberOfAffectedRows = this.dao.updateSizeInformation(mapParams);

        if (numberOfAffectedRows == 1)
        {
            return mapParams.get("product") + "의 batch 정보가 변경 되었습니다.";
        }

        return "batch 정보 변경 요청이 정상적으로 처리 되지 않았습니다.";
    }

    @GetMapping("/duplicateProduct")
    public int returnCheckResultForProduct(@RequestParam String product)
    {
        return this.dao.checkDuplicateForProduct(product);
    }

    @PostMapping("/addProduct")
    public String addProduct(
            @RequestParam(value = "product") String productName,
            @RequestParam(value = "batchSize", required = false) String batchSize,
            @RequestParam(value = "inspectionSize", required = false) String inspectionSize,
            @RequestParam(value = "specificationFile", required = false) MultipartFile specificationFile
    )
    {

        String fileName = specificationFile.getOriginalFilename();
        String strFilePath = "C:\\Users\\lsm1dae\\Desktop\\specifications\\" + fileName;
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

        HashMap<String, Object> mapParams = new HashMap<>();
        mapParams.put("product", productName);
        mapParams.put("batchSize", batchSize);
        mapParams.put("inspectionSize", inspectionSize);
        mapParams.put("specificationFilePath", strFilePath);

        int numberOfAffectedRows = this.dao.addProduct(mapParams);

        if (numberOfAffectedRows == 1)
        {
            return mapParams.get("product") + " 정보가 정상적으로 등록 되었습니다.";
        }

        return "제품등록 요청이 정상적으로 처리 되지 않았습니다.";
    }
}

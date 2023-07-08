package com.example.toolmanagingsystem.controller;

import com.example.toolmanagingsystem.dao.PunchDao;
import com.example.toolmanagingsystem.dto.PunchScrapDao;
import com.example.toolmanagingsystem.dto.Punch;
import com.example.toolmanagingsystem.vo.InspectionHistoryVO;
import lombok.RequiredArgsConstructor;
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
    private final PunchDao dao;
    @PostMapping("/register")
    public int registerPunch(@RequestBody Punch punch)
    {
        System.out.println(punch);

        return this.dao.registerPunch(punch);
    }

    @PostMapping("/updateUsageNumber")
    public void updateUsageNumber(@RequestBody HashMap<String, Object> number)
    {
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
        System.out.println(params);
        System.out.println("params");

        this.dao.addCleanHistory(params);
    }
    @PostMapping("/resetCount")
    public int resetCount(@RequestBody String number)
    {
        return this.dao.resetCountZero(number);
    }

    @GetMapping("/getCleanHistory")
    public List<Map<String, Object>> retrieveHistory(@RequestParam String punchId)
    {
        System.out.println("getCleanHistory");
        System.out.println(punchId);

        System.out.println(this.dao.retrievCleanHistory(punchId));
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
            @RequestParam(value = "batchSize", required = false) String batchSize,
            @RequestParam(value = "inspectionSize", required = false) String inspectionSize,
            @RequestParam(value = "specificationFile", required = false) MultipartFile specificationFile
    )
    {
        HashMap<String, Object> mapParams = new HashMap<>();

        if ((!Objects.equals(batchSize, "")) && (!Objects.equals(inspectionSize, "")) && (specificationFile != null))
        {
            String strFilePath = saveSpecificationFile(specificationFile);

            mapParams.put("product", productName);
            mapParams.put("batchSize", batchSize);
            mapParams.put("inspectionSize", inspectionSize);
            mapParams.put("specificationFilePath", strFilePath);
        }
        else if ((!Objects.equals(batchSize, "")) && (!Objects.equals(inspectionSize, "")))
        {
            mapParams.put("product", productName);
            mapParams.put("batchSize", batchSize);
            mapParams.put("inspectionSize", inspectionSize);
        }
        else if ((!Objects.equals(batchSize, "")) && (specificationFile != null))
        {
            String strFilePath = saveSpecificationFile(specificationFile);

            mapParams.put("product", productName);
            mapParams.put("batchSize", batchSize);
            mapParams.put("specificationFilePath", strFilePath);
        }
        else if ((!Objects.equals(inspectionSize, "")) && (specificationFile != null))
        {
            String strFilePath = saveSpecificationFile(specificationFile);

            mapParams.put("product", productName);
            mapParams.put("inspectionSize", inspectionSize);
            mapParams.put("specificationFilePath", strFilePath);
        }
        else if (!Objects.equals(batchSize, ""))
        {
            mapParams.put("product", productName);
            mapParams.put("batchSize", batchSize);
        }
        else if (!Objects.equals(inspectionSize, ""))
        {
            mapParams.put("product", productName);
            mapParams.put("inspectionSize", inspectionSize);
        }
        else if (specificationFile != null)
        {
            String strFilePath = saveSpecificationFile(specificationFile);

            mapParams.put("product", productName);
            mapParams.put("specificationFilePath", strFilePath);
        }

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
            @RequestParam("batchSize") String batchSize,
            @RequestParam("inspectionSize") String inspectionSize,
            @RequestParam("specificationFile") MultipartFile specificationFile
    )
    {
        String strFilePath = saveSpecificationFile(specificationFile);

        HashMap<String, Object> mapParams = new HashMap<>();
        mapParams.put("product", productName);
        mapParams.put("batchSize", batchSize);
        mapParams.put("inspectionSize", inspectionSize);
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


    private String saveSpecificationFile(MultipartFile specificationFile)
    {
        String fileName = specificationFile.getOriginalFilename();
        // String strFilePath = "C:\\Users\\lsm1dae\\Desktop\\specifications\\" + fileName;
        String strFilePath = "C:\\Users\\peart\\Desktop\\pdf\\specification\\" + fileName;

        fileHandling(strFilePath, specificationFile);

        return strFilePath;
    }

    private String saveInspectionFile(MultipartFile specificationFile)
    {
        String fileName = specificationFile.getOriginalFilename();
        // String strFilePath = "C:\\Users\\lsm1dae\\Desktop\\inspection\\" + fileName;
        String strFilePath = "C:\\Users\\peart\\Desktop\\pdf\\inspection\\" + fileName;

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

package com.example.toolmanagingsystem.dao;

import com.example.toolmanagingsystem.dto.request.PunchScrapRequestDao;
import com.example.toolmanagingsystem.vo.InspectionHistoryVO;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;

@Component
public class PunchDao
{
    private NamedParameterJdbcTemplate template;

    public PunchDao(HikariDataSource dataSource)
    {
        this.template = new NamedParameterJdbcTemplate(dataSource);
    }


    public int updateNewStatusForRecoveryPunch(Map<String, Object> params)
    {
        return this.template.update("update `punch-list` set `status` = :newStatus where `number` = :punchId", params);
    }

    public int deletePunchFromDeleteHistory(Map<String, Object> params)
    {
        System.out.println("params");
        System.out.println(params);


        return this.template.update("delete from `delete-history` where `punch-number` = :punchId", params);
    }

    public int checkDuplicate(String punchId)
    {
        Map<String, String> idMap = new HashMap<>();
        idMap.put("punchId", punchId);

        return this.template.queryForObject("select count(*) from `punch` where `number` = :punchId", idMap, Integer.class);
    }

    public void addCleanHistory(HashMap<String, Object> param)
    {
        List<HashMap<String, Object>> punchIdsAndDateTime = (List<HashMap<String, Object>>)  param.get("rows");

        for (HashMap<String, Object> map: punchIdsAndDateTime)
        {
            Map<String, Object> information = new HashMap<>();

            for (String key: map.keySet())
            {
                information.put(key, map.get(key));
            }

            System.out.println("information");
            System.out.println(information);



            this.template.update("insert into `clean-history` (`punch-number`, `punch-status`, `when-cleaned`, `username`, `batch`, `comment`) " +
                    "values (:punchId, :punchStatus, :cleanTimeDate, :username, :batch, :comment)", information);
        }
    }

    public List<Map<String, Object>> retrievCleanHistory(String punchId)
    {
        Map<String, String> numberMap = new HashMap<>();
        numberMap.put("punchId", punchId);

        return this.template.queryForList( "select `when-cleaned`, `username`, `batch`, `comment` from `clean-history` where `punch-number` = :punchId", numberMap);
    }

    public List<InspectionHistoryVO> retrievInspectionHistory(String punchId)
    {
        Map<String, String> input = new HashMap<>();
        input.put("punchId", punchId);

        final List<InspectionHistoryVO> output = this.template.query( "select `when-inspected`, `file-path` from `inspection-history` where `punch-number` = :punchId", input, new InspectionHistoryVO.Mapper());


        return output;
    }

    public String retrievSpecification(String punchId)
    {
        Map<String, String> numberMap = new HashMap<>();
        numberMap.put("punchId", punchId);

        return this.template.queryForObject( "select `specification` from `punch-list` where `number` = :punchId", numberMap, String.class);
    }

    public int checkDuplicateSupplier(String supplier)
    {
        Map<String, String> supplierMap = new HashMap<>();
        supplierMap.put("supplier", supplier);

        return this.template.queryForObject("select count(*) from `manufacturer` where `supplier` = :supplier", supplierMap, Integer.class);
    }

    public List<String> returnSuppliers()
    {
        Map<String, Object> paramMap = Collections.emptyMap();

        return this.template.queryForList( "select `supplier` from `manufacturer`", paramMap, String.class);
    }

    public List<Map<String, Object>> getScrappedPunchList(Map<String, Object> params)
    {
        if ("All".equals(params.get("product")))
        {
            return this.template.queryForList( "select `punch-number`, `reason`, `date`, `previous_status` from `delete-history`", params);
        }
        else
        {
            return this.template.queryForList( "select `punch-number`, `reason`, `date`, `previous_status` from `delete-history` where `product` = :product", params);
        }
    }

    public String returnCreatedDate(Map<String, Object> params)
    {
        LocalDate createdDate = this.template.queryForObject("select `created_date` from `employee` where `username` = :username", params, LocalDate.class);
        return createdDate.toString();
    }

    public int resetId(Map<String, Object> params)
    {
        return this.template.update("UPDATE `employee` SET `is_locked` = :isLocked, `trial_count` = :trialCount WHERE `username` = :username", params);
    }
}

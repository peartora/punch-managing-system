package com.example.toolmanagingsystem.dao;

import com.example.toolmanagingsystem.dto.PunchRegister;
import com.example.toolmanagingsystem.dto.PunchScrapDao;
import com.example.toolmanagingsystem.dto.PunchStatus;
import com.example.toolmanagingsystem.vo.InspectionHistoryVO;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
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

    public List<HashMap<String, Object>> getUsingPunchList(Map<String, Object> params)
    {
        String whereClauses = "WHERE p.status NOT LIKE '폐기'";

        String startDate = "";
        String endDate = "";

        String sql =
            "SELECT " +
                "p.*, " +
                "MAX(c.`when-cleaned`) AS `latestCleanDate`, " +
                "i.`when-inspected` AS `latestInspectionDate`," +
                "i1.`file-path` AS `inspectionFilePath`" +

            "FROM " +
                "`punch-list` AS p " +
            "LEFT JOIN " +
                "`clean-history` AS c " +
                "ON p.`number` = c.`punch-number` " +
            "LEFT JOIN " +
                "`inspection-history` AS i " +
                "ON p.`number` = i.`punch-number` " +
            "LEFT JOIN " +
                "`inspection-history` AS i1 " +
                "ON p.`number` = i1.`punch-number` " +

            whereClauses;

        List<HashMap<String, Object>> rowFromDB = new ArrayList<>();

        for (String key: params.keySet())
        {
            String value = (String) params.get(key);

            if (Objects.equals(key, "startDate"))
            {
                if (!Objects.equals(value, ""))
                {
                    startDate = value;
                    continue;
                }
                else
                {
                    startDate = "2001-01-01";
                    continue;
                }
            }
            else if(Objects.equals(key, "endDate"))
            {
                if (!Objects.equals(value, ""))
                {
                    endDate = value;
                    continue;
                }
                else
                {
                    startDate = "2099-12-31";
                    continue;
                }            }

            System.out.println("key:" + key);
            System.out.println("value:" + value);

            if (!Objects.equals(value, ""))
            {
                if (!Objects.equals(value, "All"))
                {
                    if (!(params.get(key) instanceof String))
                    {
                        sql += " AND " + key + " = " + params.get(key);
                    }
                    else
                    {
                        sql += " AND " + key + " = " + '"' + params.get(key) + '"';
                    }
                }
            }
        }

        if ((!Objects.equals(startDate, "")) && (!Objects.equals(endDate, "")))
        {
            sql += " AND `register-date` BETWEEN '" + startDate + "' AND '" + endDate + "'";
        }
        sql += " GROUP BY P.`number`";

        System.out.println(sql);

        this.template.query(sql, rs ->
        {
            HashMap<String, Object> singleRow = new HashMap<>();

            singleRow.put("punchId", rs.getString("number"));
            singleRow.put("punchType", rs.getString("type"));
            singleRow.put("supplier", rs.getString("manufacturer"));
            singleRow.put("specification", rs.getString("specification"));
            singleRow.put("punchStatus", rs.getString("status"));
            singleRow.put("punchStorageLocation", rs.getString("location"));
            singleRow.put("product", rs.getString("product"));
            singleRow.put("productType", rs.getString("ptype"));
            singleRow.put("latestCleaningHistory", rs.getString("latestCleanDate"));
            singleRow.put("latestInspectionDate", rs.getString("latestInspectionDate"));
            singleRow.put("inspectionFilePath", rs.getString("inspectionFilePath"));

            singleRow.put("isSelected", false);

            rowFromDB.add(singleRow);
        });
        return rowFromDB;
    }

    public void updateNewStatus(Map<String, Object> params)
    {
        this.template.update("update `punch-list` set `status` = :newStatus where `number` = :punchId", params);
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

        return this.template.queryForObject("select count(*) from `punch-list` where `number` = :punchId", idMap, Integer.class);
    }

    public void deletePunch(PunchScrapDao punchScrapDao)
    {
        Map<String, Object> deleteInformation = punchScrapDao.returnMapCollection();

        System.out.println(deleteInformation);
        System.out.println("deleteInformation");


        this.template.update("update `punch-list` set `status` = :newStatus where number = :punchId", deleteInformation);
        this.template.update("insert into `delete-history` (`punch-number`, `product`, `previous_status`, `reason`, `date`) values (:punchId, :product, :previousStatus," +
                ":reason, now())", deleteInformation);
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

    public List<String> returnProducts()
    {
        Map<String, Object> paramMap = Collections.emptyMap();

        return this.template.queryForList( "select `product` from `size-control`", paramMap, String.class);
    }

    public int checkDuplicateForProduct(String product)
    {
        Map<String, String> idMap = new HashMap<>();
        idMap.put("product", product);

        return this.template.queryForObject("select count(*) from `size-control` where `product` = :product", idMap, Integer.class);
    }

    public int updateInspectionResult(Map<String, Object> mapParamsWithPdfFile)
    {
        return this.template.update("insert into `inspection-history` (`punch-number`, `when-inspected`, `file-path`) values (:punchId, now(), :filePath)", mapParamsWithPdfFile);
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

    public String checkUserIdAndPassword(Map<String, Object> params)
    {
        return this.template.queryForObject("select `password` from `employee` where `username` = :username", params, String.class);
    }

    public int changePassword(Map<String, Object> params)
    {
        return this.template.update("UPDATE `employee` SET `password` = :newPassword, `created_date` = now() WHERE `username` = :username", params);
    }

    public String returnCreatedDate(Map<String, Object> params)
    {
        LocalDate createdDate = this.template.queryForObject("select `created_date` from `employee` where `username` = :username", params, LocalDate.class);
        return createdDate.toString();
    }

    public String returnAuthority(Map<String, Object> params)
    {
        return this.template.queryForObject("select `role` from `employee` where `username` = :username", params, String.class);
    }

    public List<Map<String, Object>> returnIdList(Map<String, Boolean> params)
    {
        return this.template.queryForList( "select `username`, `role`, `is_locked`, `is_approved` from `employee`", params);
    }

    public int resetId(Map<String, Object> params)
    {
        return this.template.update("UPDATE `employee` SET `is_locked` = :isLocked, `trial_count` = :trialCount WHERE `username` = :username", params);
    }

    public int approveId(Map<String, Object> params)
    {
        return this.template.update("UPDATE `employee` SET `is_approved` = :isApprove WHERE `username` = :username", params);
    }

    public int resetPassword(Map<String, Object> params)
    {
        return this.template.update("UPDATE `employee` SET `is_locked` = :isLocked, `trial_count` = :trialCount, `password` = :password, `created_date` = now() WHERE `username` = :username", params);
    }

    public int deleteUser(Map<String, Object> params)
    {
        return this.template.update("DELETE FROM `employee` WHERE `username` = :username", params);
    }
}

package com.example.toolmanagingsystem.dao;

import com.example.toolmanagingsystem.dto.Punch;
import com.example.toolmanagingsystem.dto.PunchScrapDao;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class PunchDao
{
    private NamedParameterJdbcTemplate template;

    public PunchDao(HikariDataSource dataSource)
    {
        this.template = new NamedParameterJdbcTemplate(dataSource);
    }

    public int registerPunch(Punch punch)
    {
        Map<String, Object> registerInformation = punch.returnMapCollection();

        String sql = "SELECT `specification-path` FROM `size-control` WHERE `product` = :product";
        String specificationPath = this.template.queryForObject(sql, registerInformation, String.class);

        registerInformation.put("specification", specificationPath);

        return this.template.update("insert into `punch-list` (`number`, `register-date`, `type`, `manufacturer`, `specification`, `status`, `location`, `product`, `ptype`, `count`) values (:number, :date, :type, :manufacturer, :specification, :status, :location, :product, :productType, 0)", registerInformation);
    }

    public List<HashMap<String, Object>> getUsingPunchList(Map<String, Object> params)
    {
        String startDate = "";
        String endDate = "";

        String sql =
            "SELECT " +
                "p.*, " +
                "MAX(c.`when-cleaned`) AS `latestCleanDate`, " +
                "MAX(i.`when-inspected`) AS `latestInspectionDate`, " +
                "s.`inspection-size` AS `inspectionSize`, " +
                "s.`batch-size` AS `batchSize` " +
            "FROM " +
                "`punch-list` AS p " +
            "LEFT JOIN " +
                "`clean-history` AS c " +
                "ON p.`number` = c.`punch-number` " +
            "LEFT JOIN " +
                "`inspection-history` AS i " +
                "ON p.`number` = i.`punch-number` " +
            "LEFT JOIN " +
                "`size-control` AS s " +
                "ON p.`product` = s.`product` " +
            "WHERE 1=1";

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
                continue;
            }
            else if(Objects.equals(key, "endDate"))
            {
                if (!Objects.equals(value, ""))
                {
                    endDate = value;
                    continue;
                }
                continue;
            }

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

            int count = rs.getInt("count");
            singleRow.put("totalUsageNumber", count);

            int inspectionSize = rs.getInt("inspectionSize");
            singleRow.put("maxUsageNumber", inspectionSize);

            singleRow.put("isSelected", false);

            int batchSize = rs.getInt("batchSize");


            if ((count > inspectionSize) || (Objects.equals(rs.getString("status"), "사용불가")))
            {
                singleRow.put("canUse", "초과");
            }
            else
            {
                if ((inspectionSize - count) <= batchSize)
                {
                    singleRow.put("canUse", "금일중만료");
                }
                else
                {
                    singleRow.put("canUse", "양호");
                }
            }

            rowFromDB.add(singleRow);
        });
        return rowFromDB;
    }

    public void updateUsageNumber(HashMap<String, Object> number)
    {
        List<HashMap<String, Object>> punchIdsWithUsageNumber = (List<HashMap<String, Object>>)  number.get("rows");

        for (HashMap<String, Object> map: punchIdsWithUsageNumber)
        {
            Map<String, Object> information = new HashMap<>();

            System.out.println("map");
            System.out.println(map);

            for (String key: map.keySet())
            {
                System.out.println(key);

                if (Objects.equals(key, "punchId"))
                {
                    information.put("punchId", map.get(key));
                }
                else
                {
                    information.put("totalUsageNumber", map.get(key));
                }

                System.out.println(information);
            }
            this.template.update("update `punch-list` set `count` = :totalUsageNumber where number = :punchId", information);
        }
    }

    public void updateNewStatus(Map<String, Object> params)
    {
        this.template.update("update `punch-list` set `status` = :newStatus where `number` = :punchId", params);
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

        System.out.println("deleteInformation");

        System.out.println(deleteInformation);

        this.template.update("update `punch-list` set `status` = :newStatus where number = :number", deleteInformation);
        this.template.update("insert into `delete-history` (`punch-number`, `reason`, `date`) values (:number, :reason, now())", deleteInformation);
    }

    public void addCleanHistory(HashMap<String, Object> number)
    {

        List<HashMap<String, Object>> punchIdsAndDateTime = (List<HashMap<String, Object>>)  number.get("rows");

        for (HashMap<String, Object> map: punchIdsAndDateTime)
        {
            Map<String, Object> information = new HashMap<>();

            for (String key: map.keySet())
            {
                information.put(key, map.get(key));
            }

            System.out.println("information");
            System.out.println(information);



            this.template.update("insert into `clean-history` (`punch-number`, `punch-status`, `when-cleaned`) values (:punchId, :punchStatus, :cleanTimeDate)", information);
        }
    }

    public int addInvestigationHistory(String number, String filePath)
    {
        Map<String, String> dataForFile = new HashMap<>();

        dataForFile.put("number", number);
        dataForFile.put("filePath", filePath);

        return this.template.update("insert into `inspection-history` (`punch-number`, `when-inspected`, `file-path`) values (:number, now(), :filePath)", dataForFile);
    }

    public int resetCountZero(String number)
    {
        Map<String, Object> information = new HashMap<>();

        information.put("number", number);
        information.put("count", 0);

        return this.template.update( "update `punch-list` set `count` = :count where number = :number", information);
    }

    public List<Map<String, Object>> retrievCleanHistory(String number)
    {
        Map<String, String> numberMap = new HashMap<>();
        numberMap.put("number", number);

        return this.template.queryForList( "select * from `clean-history` where `punch-number` = :number", numberMap);
    }

    public List<Map<String, Object>> retrievInspectionHistory(String punchId)
    {
        Map<String, String> numberMap = new HashMap<>();
        numberMap.put("punchId", punchId);

        return this.template.queryForList( "select * from `inspection-history` where `punch-number` = :punchId", numberMap);
    }

    public List<String> returnProducts()
    {
        Map<String, Object> paramMap = Collections.emptyMap();

        return this.template.queryForList( "select `product` from `size-control`", paramMap, String.class);
    }

    public int updateSizeInformation(Map<String, Object> mapParams)
    {
        int counter = 0;

        String sql = "update `size-control` set ";
        String sqlWhereClauses = " where `product` = :product";

        for (Map.Entry<String, Object> entry: mapParams.entrySet())
        {
            counter++;

            String key = entry.getKey();
            String keyForTable = "";
            String value = (String) entry.getValue();

            if (Objects.equals(key, "product"))
            {
                continue;
            }

            if (Objects.equals(key, "batchSize"))
            {
                keyForTable = "batch" + "-" + "size";
            }
            else if (Objects.equals(key, "inspectionSize"))
            {
                keyForTable = "inspection" + "-" + "size";
            }
            else if (Objects.equals(key, "specificationFilePath"))
            {
                keyForTable = "specification" + "-" + "path";
            }

            if ((!Objects.equals(value, "")))
            {
                if (counter == mapParams.size())
                {
                    sql += "`" + keyForTable + "`" + " = :" + key + ", " + "`date` = now()";
                }
                else
                {
                    sql += "`" + keyForTable + "`" + " = :" + key + ", ";
                }
            }
        }
        sql += sqlWhereClauses;

        return this.template.update(sql, mapParams);
    }

    public int checkDuplicateForProduct(String product)
    {
        Map<String, String> idMap = new HashMap<>();
        idMap.put("product", product);

        return this.template.queryForObject("select count(*) from `size-control` where `product` = :product", idMap, Integer.class);
    }

    public int addProduct(Map<String, Object> mapParams)
    {
        return this.template.update(
        "insert into `size-control` (`product`, `batch-size`, `inspection-size`, `specification-path`, `date`) " +
            "values (:product, :batchSize, :inspectionSize, :specificationFilePath, now())", mapParams);
    }

    public int updateInspectionResult(Map<String, Object> mapParamsWithPdfFile)
    {
        return this.template.update("insert into `inspection-history` (`punch-number`, `when-inspected`, `file-path`) values (:punchId, now(), :filePath)", mapParamsWithPdfFile);
    }

    public int addSupplier(HashMap<String, Object> params)
    {
        return this.template.update("insert into `manufacturer` (`supplier`) values (:supplier)", params);
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

//    "insert into `inspection-history` (`punch-number`, `when-inspected`, `file-path`) values (:number, now(), :filePath)"
}

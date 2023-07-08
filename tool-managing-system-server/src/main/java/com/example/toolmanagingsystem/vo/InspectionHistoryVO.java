package com.example.toolmanagingsystem.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@RequiredArgsConstructor
@Getter
public class InspectionHistoryVO
{
    @JsonProperty("when-inspected")
    private final ZonedDateTime time;
    @JsonProperty("file-path")
    private final String path;

    public static class Mapper implements RowMapper<InspectionHistoryVO>
    {
        @Override
        public InspectionHistoryVO mapRow(ResultSet rs, int rowNum) throws SQLException
        {
            var time = rs.getTimestamp("when-inspected").toLocalDateTime().atZone(ZoneId.of( "Asia/Seoul" ));
            var path = rs.getString("file-path");

            var instance = new InspectionHistoryVO(time, path);
            return instance;
        }
    }
}

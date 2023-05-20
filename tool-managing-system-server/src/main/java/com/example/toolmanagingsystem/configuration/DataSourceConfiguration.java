package com.example.toolmanagingsystem.configuration;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfiguration
{
    @Bean
    public HikariDataSource dataSource()
    {
        HikariDataSource dataSource = new HikariDataSource();
//        dataSource.setJdbcUrl("jdbc:mysql://10.14.2.8/tool-managing-system");
        dataSource.setJdbcUrl("jdbc:mysql://localhost/tool-managing-system");
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUsername("root");
        dataSource.setPassword("");
//        dataSource.setUsername("lsm");
//        dataSource.setPassword("lsm123");

        return dataSource;
    }
}

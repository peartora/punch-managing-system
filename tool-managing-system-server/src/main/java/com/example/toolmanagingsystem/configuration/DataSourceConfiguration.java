package com.example.toolmanagingsystem.configuration;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSourceConfiguration
{
    @Bean
    public HikariDataSource dataSource()
    {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl("jdbc:mysql://10.14.2.108:3306/punch_management_system");
//        dataSource.setJdbcUrl("jdbc:mysql://localhost:3306/PUNCH_MANAGEMENT_SYSTEM");

        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUsername("root");
        dataSource.setPassword("");

        return dataSource;
    }
}

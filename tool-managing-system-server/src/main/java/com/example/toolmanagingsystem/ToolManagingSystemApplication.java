package com.example.toolmanagingsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ToolManagingSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(ToolManagingSystemApplication.class, args);
	}

}

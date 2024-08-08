package com.example.toolmanagingsystem.controller;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.entity.Medicine;
import com.example.toolmanagingsystem.entity.logging.LoggingActivity;
import com.example.toolmanagingsystem.error.logging.UserListNotExistedException;
import com.example.toolmanagingsystem.error.medicine.MedicineNotExistedException;
import com.example.toolmanagingsystem.repository.LoggingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/tool-managing-system/logging")
@RequiredArgsConstructor
public class LoggingApiController
{
    private final LoggingRepository loggingRepository;

    @GetMapping("/getUserList")
    public ApiResponse returnUserList()
    {
        System.out.println("returnUserList");

        List<String> userList = this.loggingRepository.returnUserList();

        if (userList.isEmpty())
        {
            throw new UserListNotExistedException();
        }

        return ApiResponse.success(userList);
    }

    @GetMapping("/getActivityList")
    public ApiResponse returnActivityList()
    {
        System.out.println("returnActivityList");

        List<LoggingActivity> activityList = this.loggingRepository.returnActivityList();

        if (activityList.isEmpty())
        {
            throw new UserListNotExistedException();
        }

        return ApiResponse.success(activityList);
    }
}

package com.example.toolmanagingsystem.controller.user;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.user.ResetPasswordRequestDto;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.error.user.NewPasswordSameWithCurrentPasswordException;
import com.example.toolmanagingsystem.error.user.NotAuthorizeRequestException;
import com.example.toolmanagingsystem.error.user.PasswordLengthIsNotEnoughException;
import com.example.toolmanagingsystem.error.user.UserIsNotExistException;
import com.example.toolmanagingsystem.repository.UserRepository;
import com.example.toolmanagingsystem.service.userService.AdminApiService;
import com.example.toolmanagingsystem.service.userService.UserApiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/tool-managing-system/admin")
@RequiredArgsConstructor
public class AdminApiController
{
    private final UserRepository userRepository;
    private final UserApiService userApiService;
    private final AdminApiService adminApiService;

    @GetMapping("/idList")
    public List<Map<String, Object>> returnIdList()
    {
        System.out.println("returnIdList");

        List<Map<String, Object>> idList = new ArrayList<>();
        Iterable<User> userIterableList = this.userRepository.findAll();

        for (User user: userIterableList)
        {
            Map<String, Object> idMap = new HashMap<>();
            idMap.put("username", user.getUsername());
            idMap.put("is_not_locked", user.isNotLocked());
            idMap.put("is_approved", user.isApproved());
            idMap.put("role", user.getUserRole());
            idList.add(idMap);
        }

        return idList;
    }

    @PostMapping("/approveId")
    public ApiResponse approveId(@RequestBody Map<String, String> params)
    {
        System.out.println("approveId");
        return this.adminApiService.approveId(params);
    }

    @PostMapping("/resetPassword")
    public ApiResponse resetPassword(@RequestBody @Valid ResetPasswordRequestDto requestDto, BindingResult bindingResult)
    {
        System.out.println("resetPassword");
        System.out.println(requestDto);
        this.userApiService.validateUserFormFields(bindingResult);

        return this.adminApiService.resetPassword(requestDto, bindingResult);
    }

    @PostMapping("/delete_user")
    public ApiResponse deleteUser(@RequestBody Map<String, Object> params)
    {
        System.out.println("deleteUser");
        System.out.println(params);

        return this.adminApiService.deleteUser(params);
    }
}

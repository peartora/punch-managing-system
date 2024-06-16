package com.example.toolmanagingsystem.controller.user;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.user.ResetPasswordRequestDto;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.error.user.NewPasswordSameWithCurrentPasswordException;
import com.example.toolmanagingsystem.error.user.NotAuthorizeRequestException;
import com.example.toolmanagingsystem.error.user.PasswordLengthIsNotEnoughException;
import com.example.toolmanagingsystem.error.user.UserIsNotExistException;
import com.example.toolmanagingsystem.repository.UserRepository;
import com.example.toolmanagingsystem.service.userService.UserApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/tool-managing-system/admin")
@RequiredArgsConstructor
public class AdminApiController
{
    private final UserRepository userRepository;
    private final UserApiService userApiService;

    @GetMapping("/idList")
    public List<Map<String, Object>> returnIdList()
    {
        log.debug("returnIdList");

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
    public ApiResponse approveId(@RequestBody Map<String, Object> params)
    {
        log.debug("approveId");
        log.debug("{}", params);

        User user = this.userRepository.findByUsername(params.get("username").toString());

        if (user == null)
        {
            throw new UserIsNotExistException();
        }

        user.setApproved(true);
        user.setNotExpired(true);
        user.setNotLocked(true);

        this.userRepository.save(user);

        return ApiResponse.success(params.get("username"));
    }

    @PostMapping("/resetPassword")
    public ApiResponse resetPassword(@RequestBody ResetPasswordRequestDto requestDto)
    {
        log.debug("resetPassword");
        log.debug("{}", requestDto);

        User user = this.userRepository.findByUsername(requestDto.getUsername());
        User loginUser = this.userRepository.findByUsername(requestDto.getLoginUsername());

        if (user == null)
        {
            log.debug("user is null");
            throw new UserIsNotExistException();
        }

        if (!Objects.equals(loginUser.getUserRole().toString(), "ADMIN"))
        {
            log.debug("not authorized");
            throw new NotAuthorizeRequestException();
        }

        String currentPassword = user.getPassword();
        String newPassword = requestDto.getNewPassword();

        log.debug("currentPassword: " + currentPassword);
        log.debug("newPassword: " + newPassword);


        if (currentPassword.equals(newPassword))
        {
            log.debug("password is same for resetPassword");
            throw new NewPasswordSameWithCurrentPasswordException();
        }

        if (newPassword.length() < 6) {
            throw new PasswordLengthIsNotEnoughException();
        }

        user.setPassword(newPassword);
        user = userApiService.initializeUser(user);
        this.userRepository.save(user);

        return ApiResponse.success(requestDto.getUsername());
    }

    @PostMapping("/delete_user")
    public ApiResponse deleteUser(@RequestBody Map<String, Object> params)
    {
        log.debug("deleteUser");
        log.debug("{}", params);

        User user = this.userRepository.findByUsername(params.get("username").toString());

        if (user == null)
        {
            throw new UserIsNotExistException();
        }

        this.userRepository.delete(user);
        return ApiResponse.success(params.get("username"));
    }
}

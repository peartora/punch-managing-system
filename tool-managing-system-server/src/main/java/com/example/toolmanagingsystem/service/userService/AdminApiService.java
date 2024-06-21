package com.example.toolmanagingsystem.service.userService;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminApiService {

    private final UserRepository userRepository;
    private final UserApiService userApiService;

    public ApiResponse approveId(Map<String, String> params)
    {
        String username = params.get("username");

        this.userApiService.validateUser(username);
        User user = this.userRepository.findByUsername(username);

        user.setApproved(true);

        this.userRepository.save(user);

        return ApiResponse.success(username);
    }

}

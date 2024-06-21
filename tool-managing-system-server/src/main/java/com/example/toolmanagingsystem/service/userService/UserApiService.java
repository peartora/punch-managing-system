package com.example.toolmanagingsystem.service.userService;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.user.LoginRequestDto;
import com.example.toolmanagingsystem.dto.request.user.UserRegisterRequestDto;
import com.example.toolmanagingsystem.dto.response.user.LoginResponseDto;
import com.example.toolmanagingsystem.entity.punch.PunchStatus;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.entity.user.UserRole;
import com.example.toolmanagingsystem.error.user.*;
import com.example.toolmanagingsystem.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.*;

@Service
public class UserApiService
{
    @Autowired
    UserRepository userRepository;

    public ApiResponse registerUser(@RequestBody UserRegisterRequestDto requestDto)
    {
        String password = requestDto.getPassword();
        String passwordConfirmation = requestDto.getPasswordConfirmation();

        this.isPasswordSame(password, passwordConfirmation);
        this.isPasswordLongEnough(requestDto);

        User user = new User(requestDto);

        try
        {
            this.userRepository.save(user);
        }
        catch (Exception e)
        {
            throw new DuplicatedUsernameException();
        }

        return ApiResponse.success(user.getUsername());
    }

    public ApiResponse login(LoginRequestDto requestDto) {
        String username = requestDto.getUsername();

        this.validateUser(username);

        User user = this.userRepository.findByUsername(username);

        this.isUserApproved(user);
        this.isUserNotLocked(user);
        this.isUserNotExpired(user);

        String password = requestDto.getPassword();
        String passwordConfirmation = user.getPassword();

        if (!Objects.equals(password, passwordConfirmation))
        {
            int loginTrialCount = user.getTrialCount();

            if (loginTrialCount == 4)
            {
                user.setTrialCount(5);
                user.setNotLocked(false);
            }
            else
            {
                user.setTrialCount(loginTrialCount + 1);
            }
            this.userRepository.save(user);
            throw new UserLoginPasswordNotCorrectException();
        }
        else
        {
            user.setTrialCount(0);
        }

        this.userRepository.save(user);
        return ApiResponse.success(username);
    }

    public boolean checkUserAuthority(String username, List<String> targetList)
    {
        User user = this.userRepository.findByUsername(username);
        String userRole = user.getUserRole().toString();

        return targetList.contains(userRole);
    }

    private void increaseTrialcount(User user) {
        int trialCount = user.getTrialCount();

        if (trialCount == 4) {
            user.setTrialCount(5);
            user.setNotLocked(false);
            this.userRepository.save(user);

            throw new UserIsLockedException();
        } else {
            user.setTrialCount(trialCount + 1);
            this.userRepository.save(user);
        }
    }

    public User initializeUser(User user)
    {
        user.setTrialCount(0);
        user.setPasswordSetDate(LocalDate.now());
        user.setNotExpired(true);
        user.setNotLocked(true);

        return user;
    }



//    @Scheduled 이 함수는, 매일 자정 패스워드 유효 여부 확인
    public void isPasswordValid() {
        Iterable<User> userIterable = this.userRepository.findAll();
        List<User> userList = new ArrayList<>();

        LocalDate today = LocalDate.now();

        for (User user: userIterable) {
            LocalDate registerDate = user.getCreatedDate();
            LocalDate sixMonthAfter = registerDate.plusMonths(6);

            if (sixMonthAfter.isBefore(today)) {
                user.setNotExpired(true);
                userList.add(user);
            }
        }
        this.userRepository.saveAll(userList);
    }

    private void isPasswordSame(String password, String passwordConfirmation) throws PasswordNotSameException
    {
        if (!password.equals(passwordConfirmation))
        {
            throw new PasswordNotSameException();
        }
    }

    private void isPasswordLongEnough(UserRegisterRequestDto requestDto) throws PasswordLengthIsNotEnoughException
    {
        String password = requestDto.getPassword();

        if (password.length() < 6)
        {
            throw new PasswordLengthIsNotEnoughException();
        }
    }

    private void validateUser(String username)
    {
        User user = this.userRepository.findByUsername(username);

        if (user == null)
        {
            throw new UserIsNotExistException();
        }
    }

    private void isUserApproved(User user)
    {
        if (!user.isApproved())
        {
            throw new UserIsNotApprovedException();
        }
    }

    private void isUserNotLocked(User user) {
        if (!user.isNotLocked())
        {
            throw new UserIsLockedException();
        }
    }

    private void isUserNotExpired(User user) {
        if (!user.isNotExpired())
        {
            throw new UserIsExpiredException();
        }
    }

}

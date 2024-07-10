package com.example.toolmanagingsystem.service.userService;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.user.LoginRequestDto;
import com.example.toolmanagingsystem.dto.request.user.PasswordChangeRequestDto;
import com.example.toolmanagingsystem.dto.request.user.UserRegisterRequestDto;
import com.example.toolmanagingsystem.dto.response.user.LoginResponseDto;
import com.example.toolmanagingsystem.entity.punch.PunchStatus;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.entity.user.UserRole;
import com.example.toolmanagingsystem.error.UnknownInputValidationException;
import com.example.toolmanagingsystem.error.user.*;
import com.example.toolmanagingsystem.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.RequestBody;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
public class UserApiService
{
    @Autowired
    UserRepository userRepository;
    @Value("${PASSWORD_EXPIRE_PERIOD}")
    private int passwordExpirePeriod;

    public ApiResponse registerUser(@RequestBody UserRegisterRequestDto requestDto)
    {
        String password = requestDto.getPassword();
        String passwordConfirmation = requestDto.getPasswordConfirmation();

        this.isPasswordSame(password, passwordConfirmation);

        User user = new User(requestDto);

        user.setApproved(false);
        user.setNotExpired(true);
        user.setNotLocked(true);
        user.setTrialCount(0);

        try
        {
            this.userRepository.save(user);
        }
        catch (Exception e)
        {
            throw new DuplicatedUsernameException();
        }

        log.info("User Id: {}가 등록 되었습니다.", user.getUsername());
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
            log.info("User Id: {} 로그인 중 비밀번호가 틀렸습니다.", user.getUsername());

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
        log.info("User Id: {}가 로그인 되었습니다.", user.getUsername());
        this.userRepository.save(user);

        return ApiResponse.success(username);
    }

    public ApiResponse passwordChange(PasswordChangeRequestDto requestDto)
    {
        String username = requestDto.getUsername();
        this.validateUser(username);

        String newPassword = requestDto.getNewPassword();
        String newPasswordConfirmation = requestDto.getNewPasswordForConfirmation();

        this.isPasswordSame(newPassword, newPasswordConfirmation);

        User user = this.userRepository.findByUsername(username);

        this.isNewPasswordSameWithCurrentPassword(user.getPassword(), newPassword);

        user.setPassword(newPassword);
        user.setPasswordSetDate(LocalDate.now());
        user.setTrialCount(0);

        this.userRepository.save(user);

        log.info("User Id: {}의 비밀번호가 변경 되었습니다.", user.getUsername());
        return ApiResponse.success(username);
    }

    @Scheduled(cron = "0 * * * * *")
    public void isPasswordValid()
    {
        System.out.println("password check");
        Iterable<User> userIterable = this.userRepository.findAll();
        List<User> userList = new ArrayList<>();

        LocalDate today = LocalDate.now();

        for (User user: userIterable)
        {
            LocalDate passwordSetDate = user.getPasswordSetDate();
            LocalDate expirationDate = passwordSetDate.plusMonths(this.passwordExpirePeriod);

            if (expirationDate.isBefore(today))
            {
                log.info("User Id: {}의 비밀번호가 만료 되었습니다.", user.getUsername());
                user.setNotExpired(false); // 개인 user가, 비밀번호 변경을 통해 계정 만료를 해제 할 수 있음
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

    public void isNewPasswordSameWithCurrentPassword(String currentPassword, String newPassword) throws NewPasswordSameWithCurrentPasswordException
    {
        if (currentPassword.equals(newPassword))
        {
            throw new NewPasswordSameWithCurrentPasswordException();
        }
    }

    public void validateUser(String username)
    {
        System.out.println("username");
        System.out.println(username);

        User user = this.userRepository.findByUsername(username);

        if (user == null)
        {
            throw new UserIsNotExistException();
        }
    }

    public void validateUserFormFields(BindingResult bindingResult)
    {
        if (bindingResult.hasErrors())
        {
            List<FieldError> fieldErrorList = bindingResult.getFieldErrors();
            for (FieldError fieldError: fieldErrorList)
            {
                String errorCode = fieldError.getCode();

                switch (errorCode)
                {
                    case "Size" : throw new PasswordLengthIsNotEnoughException();
                    default : throw new UnknownInputValidationException();
                }
            }
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

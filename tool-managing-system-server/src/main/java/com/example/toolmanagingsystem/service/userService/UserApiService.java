package com.example.toolmanagingsystem.service.userService;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.user.LoginRequestDto;
import com.example.toolmanagingsystem.dto.request.user.PasswordChangeRequestDto;
import com.example.toolmanagingsystem.dto.request.user.UserRegisterRequestDto;
import com.example.toolmanagingsystem.dto.response.user.LoginResponseDto;
import com.example.toolmanagingsystem.entity.logging.Logging;
import com.example.toolmanagingsystem.entity.logging.LoggingActivity;
import com.example.toolmanagingsystem.entity.punch.PunchStatus;
import com.example.toolmanagingsystem.entity.user.User;
import com.example.toolmanagingsystem.entity.user.UserRole;
import com.example.toolmanagingsystem.error.UnknownInputValidationException;
import com.example.toolmanagingsystem.error.user.*;
import com.example.toolmanagingsystem.repository.LoggingRepository;
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
    @Autowired
    LoggingRepository loggingRepository;
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

        Logging logging = new Logging(user.getUsername(), LoggingActivity.REGISTER);
        this.loggingRepository.save(logging);
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
            Logging logging = new Logging(user.getUsername(), LoggingActivity.LOGIN_FAIL);
            this.loggingRepository.save(logging);

            int loginTrialCount = user.getTrialCount();

            if (loginTrialCount == 4)
            {
                user.setTrialCount(5);
                user.setNotLocked(false);

//                log.info("User Id: {} 비밀번호 5회 틀렸습니다. 계정이 잠김 상태로 변경 됩니다.", user.getUsername());
                Logging loggingUseridLocked = new Logging(user.getUsername(), LoggingActivity.LOCKED);
                this.loggingRepository.save(loggingUseridLocked);
            }
            else
            {
                int currentTrialCount = loginTrialCount + 1;
                user.setTrialCount(currentTrialCount);
            }
            this.userRepository.save(user);
            throw new UserLoginPasswordNotCorrectException();
        }
        else
        {
            user.setTrialCount(0);
        }
        Logging logging = new Logging(user.getUsername(), LoggingActivity.LOGIN);
        this.loggingRepository.save(logging);
//        log.info("User Id: {}가 로그인 되었습니다.", user.getUsername());
        this.userRepository.save(user);

        return ApiResponse.success(username);
    }

    public ApiResponse passwordChange(PasswordChangeRequestDto requestDto)
    {
        String username = requestDto.getUsername();
        this.validateUser(username);

        User user = this.userRepository.findByUsername(username);

        if (!user.isNotLocked())
        {
            throw new UserIsLockedException();
        }

        String newPassword = requestDto.getNewPassword();
        String newPasswordConfirmation = requestDto.getNewPasswordForConfirmation();

        this.isPasswordSame(newPassword, newPasswordConfirmation);


        this.isNewPasswordSameWithCurrentPassword(user.getPassword(), newPassword);

        user.setPassword(newPassword);
        user.setPasswordSetDate(LocalDate.now());
        user.setTrialCount(0);
        user.setNotExpired(true);

        this.userRepository.save(user);

        Logging logging = new Logging(user.getUsername(), LoggingActivity.PASSWORD_CHANGE);
        this.loggingRepository.save(logging);

//        log.info("User Id: {}의 비밀번호가 변경 되었습니다.", user.getUsername());
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
            if (!user.isNotExpired())
            {
                continue;
            }

            System.out.println(user.getUsername());

            LocalDate passwordSetDate = user.getPasswordSetDate();
            LocalDate expirationDate = passwordSetDate.plusMonths(this.passwordExpirePeriod);

            if (expirationDate.isBefore(today))
            {
//                log.info("User Id: {}의 비밀번호가 만료 되었습니다.", user.getUsername());
                user.setNotExpired(false); // 개인 user가, 비밀번호 변경을 통해 계정 만료를 해제 할 수 있음
                userList.add(user);
                Logging logging = new Logging(user.getUsername(), LoggingActivity.PASSWORD_EXPIRED);
                this.loggingRepository.save(logging);
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
            System.out.println("It`s null");
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

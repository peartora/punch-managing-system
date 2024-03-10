package com.example.toolmanagingsystem.entity.logging;

public enum LoggingActivity
{
    LOGIN_TRIAL,
    LOGIN,
    LOGIN_FAIL_PASSWORD_UNREGISTERED_ID,
    LOGIN_FAIL_PASSWORD_EXPIRED,
    LOGIN_FAIL_PASSWORD_INCORRECT,
    LOGIN_FAIL_NOT_APPROVED_ID,
    LOGIN_FAIL_LOCKED_ID,
    PASSWORD_CHANGE,
    LOGOUT;
}

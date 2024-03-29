package com.example.toolmanagingsystem.entity.punch;

public enum PunchStatus
{
    사용대기(0), 사용가능(1), 사용중(2), 폐기(3);

    private final int statusValue;

    PunchStatus(int statusValue)
    {
        this.statusValue = statusValue;
    }

    public int getStatusValue()
    {
        return statusValue;
    }

    public static PunchStatus valueOf(int statusValue)
    {
        return switch (statusValue)
        {
            case 0 -> PunchStatus.사용대기;
            case 1 -> PunchStatus.사용가능;
            case 2 -> PunchStatus.사용중;
            case 3 -> PunchStatus.폐기;
            default -> throw new IllegalStateException("Unexpected value: " + statusValue);
        };
    }
}

package com.example.toolmanagingsystem.service;

import com.example.toolmanagingsystem.dto.ApiResponse;
import org.springframework.data.repository.CrudRepository;

public abstract class GenericService <E, R extends CrudRepository<E, Integer>>
{
    R repository;

    public ApiResponse add(E entity)
    {
        this.repository.save(entity);
        return ApiResponse.success(entity);
    }
    public ApiResponse delete(E entity)
    {
        this.repository.delete(entity);
        return ApiResponse.success(entity);
    }
}

package com.example.toolmanagingsystem.controller;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.service.GenericService;

public abstract class GenericController<E, K, S extends GenericService>
{
    S service;

    public ApiResponse add(E entity)
    {
        return this.service.add(entity);
    }
    public ApiResponse delete(E entity)
    {
        return this.service.delete(entity);
    }

}

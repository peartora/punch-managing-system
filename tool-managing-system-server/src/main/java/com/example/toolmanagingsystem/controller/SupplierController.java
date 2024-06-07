package com.example.toolmanagingsystem.controller;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.SupplierRegisterRequestDto;
import com.example.toolmanagingsystem.entity.Supplier;
import com.example.toolmanagingsystem.error.supplier.SupplierAlreadyExistedException;
import com.example.toolmanagingsystem.repository.SupplierRepository;
import com.example.toolmanagingsystem.service.supplierService.SupplierApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tool-managing-system/supplier")
@RequiredArgsConstructor
public class SupplierController
{
    private final SupplierRepository supplierRepository;
    private final SupplierApiService supplierService;

    @PostMapping
    public ApiResponse registerSupplier(@RequestBody SupplierRegisterRequestDto requestDto)
    {
        System.out.println("registerSupplier");
        System.out.println(requestDto);

        Supplier supplier = new Supplier(requestDto.getSupplier());

        try
        {
            this.supplierRepository.save(supplier);
        }
        catch (Exception e)
        {
            throw new SupplierAlreadyExistedException();
        }

        return ApiResponse.success(requestDto.getSupplier());
    }
}

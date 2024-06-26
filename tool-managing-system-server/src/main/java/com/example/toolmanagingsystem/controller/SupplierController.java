package com.example.toolmanagingsystem.controller;

import com.example.toolmanagingsystem.dto.ApiResponse;
import com.example.toolmanagingsystem.dto.request.SupplierRegisterRequestDto;
import com.example.toolmanagingsystem.entity.Supplier;
import com.example.toolmanagingsystem.error.supplier.SupplierAlreadyExistedException;
import com.example.toolmanagingsystem.error.supplier.SupplierNotExistedException;
import com.example.toolmanagingsystem.repository.SupplierRepository;
import com.example.toolmanagingsystem.service.supplierService.SupplierApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/tool-managing-system/supplier")
@RequiredArgsConstructor
public class SupplierController
{
    private final SupplierRepository supplierRepository;
    private final SupplierApiService supplierService;

    @GetMapping
    public ApiResponse getSupplierList()
    {
        System.out.println("getSupplierList");

        List<Supplier> supplierList = this.supplierRepository.findAll();

        if (supplierList.isEmpty())
        {
            throw new SupplierNotExistedException();
        }

        List<String> supplierNameList = new ArrayList<>();

        for (Supplier supplier: supplierList)
        {
            supplierNameList.add(supplier.getSupplier());
        }

        return ApiResponse.success(supplierNameList);
    }

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

package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.services.impl.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<?> getTransactions(@RequestParam(required = false, defaultValue = "0") int branchId,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "10") int size) {

        return new ResponseEntity<>(transactionService.getAllTransactions(page, size, branchId), HttpStatus.OK);
    }
}

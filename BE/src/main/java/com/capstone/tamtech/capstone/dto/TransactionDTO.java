package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TransactionDTO {
    private String paymentCode;
    private double amount;
    private Date transactionDate;
    private String paymentMethod;
}

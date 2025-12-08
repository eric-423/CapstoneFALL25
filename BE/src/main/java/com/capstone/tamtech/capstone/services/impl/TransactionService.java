package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.TransactionDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;

public interface TransactionService {
    PagedResponse<TransactionDTO> getAllTransactions(int page, int size, int branchId);
}

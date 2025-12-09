package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.TransactionDTO;
import com.capstone.tamtech.capstone.entities.Order;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.ProductSearchRequest;
import com.capstone.tamtech.capstone.repositories.OrderRepository;
import com.capstone.tamtech.capstone.services.impl.OrderService;
import com.capstone.tamtech.capstone.services.impl.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public PagedResponse<TransactionDTO> getAllTransactions(int page, int size, int branchId) {
        Page<Order> orders;

        if (branchId == 0) {
            orders = orderRepository.findAll(createPageable(page, size));
        } else {
            orders = orderRepository.findByBranch_Id(branchId, createPageable(page, size));
        }

        if (orders != null) {
            List<TransactionDTO> transactionDTOS = new ArrayList<>();

            for (Order order : orders) {
                if (order.getIsTable() && order.getPaymentTime() == null) {
                    continue;
                }
                TransactionDTO transactionDTO = new TransactionDTO();
                transactionDTO.setPaymentCode(order.getPaymentCode());
                transactionDTO.setAmount(order.getAmount());
                transactionDTO.setTransactionDate(order.getPaymentTime());
                transactionDTO.setPaymentMethod(order.getPaymentMethod().getName());
                transactionDTOS.add(transactionDTO);
            }

            return createPagedResponse(orders, transactionDTOS);
        }

        return null;
    }

    private <T> PagedResponse<T> createPagedResponse(Page<?> page, List<T> content) {
        PagedResponse<T> response = new PagedResponse<>();
        response.setContent(content);
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setLast(page.isLast());
        response.setFirst(page.isFirst());
        response.setEmpty(page.isEmpty());
        return response;
    }

    private Pageable createPageable(int page, int size) {
        if (size > 100) {
            size = 100;
        }
        Sort sort = Sort.by(Sort.Direction.fromString("DESC"), "createdAt");

        return PageRequest.of(page, size, sort);
    }

}

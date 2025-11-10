package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.PaymentMethodDTO;
import com.capstone.tamtech.capstone.entities.PaymentMethod;
import com.capstone.tamtech.capstone.repositories.PaymentMethodRepository;
import com.capstone.tamtech.capstone.services.impl.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class PaymentMethodServiceImpl implements PaymentMethodService {

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @Override
    public List<PaymentMethodDTO> getAllPaymentMethods() {
        List<PaymentMethod> paymentMethods = paymentMethodRepository.findAll();
        if(!paymentMethods.isEmpty()){
            return paymentMethods.stream().map(this::toDTO).toList();
        }

        return List.of();
    }

    private PaymentMethodDTO toDTO(PaymentMethod paymentMethod){
        PaymentMethodDTO paymentMethodDTO = new PaymentMethodDTO();

        paymentMethodDTO.setId(paymentMethod.getId());
        paymentMethodDTO.setName(paymentMethod.getName());

        return paymentMethodDTO;
    }
}

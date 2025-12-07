package com.capstone.tamtech.capstone.controllers;


import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.services.impl.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payment-method")
public class PaymentMethodController {


    @Autowired
    private PaymentMethodService paymentMethodService;

    @GetMapping
    public ResponseEntity<?> getALlPaymentMethod(){
        ResponseData responseData = new ResponseData();
        responseData.setData(paymentMethodService.getAllPaymentMethods());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}

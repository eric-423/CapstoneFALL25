package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.services.OrderBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderBillController {

    @Autowired
    private OrderBillService orderBillService;

    @GetMapping("/{orderId}/bill/download")
    public ResponseEntity<?> downloadBill(@PathVariable int orderId) {
        try {
            byte[] pdfBytes = orderBillService.generateBillPdf(orderId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "bill-" + orderId + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Failed to generate bill: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{orderId}/bill/regenerate")
    public ResponseEntity<?> regenerateBill(@PathVariable int orderId) {
        try {
            orderBillService.regenerateBill(orderId);

            ResponseData responseData = new ResponseData();
            responseData.setDesc("Bill regenerated successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Failed to regenerate bill: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

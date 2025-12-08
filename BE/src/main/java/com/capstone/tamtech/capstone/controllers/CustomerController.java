package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.CustomerBaseInfoDTO;
import com.capstone.tamtech.capstone.dto.CustomerDTO;
import com.capstone.tamtech.capstone.dto.InformationDTO;
import com.capstone.tamtech.capstone.entities.Information;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.InformationRequest;
import com.capstone.tamtech.capstone.services.impl.AuthService;
import com.capstone.tamtech.capstone.services.impl.InformationService;
import com.capstone.tamtech.capstone.services.impl.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    @Autowired
    private InformationService informationService;

    @Autowired
    private AuthService authService;

    @PostMapping("/{customerId}/informations")
    public ResponseEntity<Information> addInformation(@PathVariable int customerId,
            @RequestBody InformationRequest request) {
        Information created = informationService.addInformation(customerId, request);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{customerId}/point")
    public ResponseEntity<?> getCustomerPoint(@PathVariable int customerId) {
        int point = informationService.getTotalPoints(customerId);

        ResponseData responseData = new ResponseData();
        responseData.setData(point);

        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/find/by-phone")
    public ResponseEntity<?> getCustomerByPhone(@RequestParam String phone) {
        CustomerDTO customer = informationService.getCustomerByPhone(phone);

        ResponseData responseData = new ResponseData();
        responseData.setData(customer);

        return ResponseEntity.ok(responseData);
    }


    @GetMapping("/{customerId}/base-info")
    public ResponseEntity<?> getBaseInfo(@PathVariable int customerId) {
        CustomerBaseInfoDTO baseInfo = informationService.getBaseInfo(customerId);

        return ResponseEntity.ok(baseInfo);
    }

    @PutMapping("/{customerId}/informations/{informationId}")
    public ResponseEntity<Information> updateInformation(@PathVariable int customerId,
            @PathVariable int informationId,
            @RequestBody InformationRequest request) {
        Information updated = informationService.updateInformation(customerId, informationId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{customerId}/informations/{informationId}")
    public ResponseEntity<Void> deleteInformation(@PathVariable int customerId,
            @PathVariable int informationId) {
        informationService.deleteInformation(customerId, informationId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{customerId}/informations/{informationId}")
    public ResponseEntity<?> getInformation(@PathVariable int customerId,
            @PathVariable int informationId) {
        InformationDTO info = informationService.getInformation(customerId, informationId);
        ResponseData responseData = new ResponseData();
        responseData.setData(info);
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/{customerId}/informations")
    public ResponseEntity<?> getAllInformations(@PathVariable int customerId) {
        List<InformationDTO> infos = informationService.getAllInformations(customerId);
        ResponseData responseData = new ResponseData();
        responseData.setData(infos);

        return ResponseEntity.ok(responseData);
    }
}

package com.capstone.tamtech.capstone.controllers;


import com.capstone.tamtech.capstone.dto.DiningTableDTO;
import com.capstone.tamtech.capstone.dto.OrderDTO;
import com.capstone.tamtech.capstone.payload.request.DiningTableRequest;
import com.capstone.tamtech.capstone.services.impl.DiningTableService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/table")
public class DiningTableController {

    @Autowired
    DiningTableService diningTableService;


    @GetMapping()
    public ResponseEntity<?> getAllDiningTables() {
        return new ResponseEntity<>(diningTableService.getAllDiningTables(), org.springframework.http.HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDiningTableDetailById(@PathVariable int id) {
        DiningTableDTO result = diningTableService.getDiningTableById(id);
        if (result == null) {
            return new ResponseEntity<>("Dining table not found", org.springframework.http.HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(result, org.springframework.http.HttpStatus.OK);
    }

    @GetMapping("/current-order/{tableId}")
    public ResponseEntity<?> getCurrentOrderForDiningTable(@PathVariable int tableId) {
        OrderDTO result = diningTableService.getCurrentOrderForDiningTable(tableId);
        if (result == null) {
            return new ResponseEntity<>("No current order found for the dining table", org.springframework.http.HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(result, org.springframework.http.HttpStatus.OK);
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<?> getAllDiningTableWithBranch(@PathVariable int branchId) {
        return new ResponseEntity<>(diningTableService.getAllDiningTableWithBranch(branchId), org.springframework.http.HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<?> createDiningTable(@RequestBody DiningTableRequest diningTableRequest) {
        DiningTableDTO result = diningTableService.createDiningTable(diningTableRequest);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }


    @DeleteMapping("/inactive/{id}")
    public ResponseEntity<?> setDiningTableInactive(@PathVariable int id) {
        boolean result = diningTableService.setDiningTableInactive(id);
        if (!result) {
            return new ResponseEntity<>("Dining table not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("Dining table set to inactive", HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDiningTable(@PathVariable int id, @RequestBody DiningTableRequest diningTableRequest) {
        DiningTableDTO result = diningTableService.updateDiningTable(id, diningTableRequest);
        if (result == null) {
            return new ResponseEntity<>("Dining table not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}

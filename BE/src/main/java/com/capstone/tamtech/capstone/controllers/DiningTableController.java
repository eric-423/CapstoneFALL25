package com.capstone.tamtech.capstone.controllers;


import com.capstone.tamtech.capstone.services.impl.DiningTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/table")
public class DiningTableController {

    @Autowired
    DiningTableService diningTableService;



    @GetMapping()
    public ResponseEntity<?> getAllDiningTables(){
        return new ResponseEntity<>(diningTableService.getAllDiningTables(), org.springframework.http.HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDiningTableDetailById(@PathVariable  int id){
        com.capstone.tamtech.capstone.dto.DiningTableDTO result = diningTableService.getDiningTableById(id);
        if (result == null) {
            return new ResponseEntity<>("Dining table not found", org.springframework.http.HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(result, org.springframework.http.HttpStatus.OK);
    }


}

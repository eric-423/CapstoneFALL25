package com.capstone.tamtech.capstone.controllers;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/table")
public class DiningTableController {



    @GetMapping()
    public ResponseEntity<?> getDiningTable(int branchId){

    }

    @GetMapping("/id")
    public ResponseEntity<?> getDiningTableDetailById(@PathVariable  int id){

    }


}

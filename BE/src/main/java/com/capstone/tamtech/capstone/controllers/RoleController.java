package com.capstone.tamtech.capstone.controllers;


import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.RoleRequest;
import com.capstone.tamtech.capstone.services.impl.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @GetMapping
    public ResponseEntity<?> getAllRoles() {
        ResponseData responseData = new ResponseData();
        responseData.setData(roleService.getAllRoles());
        return ResponseEntity.ok(responseData);
    }

    @PostMapping()
    public ResponseEntity<?> createRole(@RequestBody RoleRequest roleRequest) {
        ResponseData responseData = new ResponseData();
        responseData.setData(roleService.createRole(roleRequest));

        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PutMapping("/{roleId} ")
    public ResponseEntity<?> updateRole(@PathVariable int roleId) {
        ResponseData responseData = new ResponseData();
        responseData.setData(roleService.updateRole(roleId));
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/{roleId} ")
    public ResponseEntity<?> getRoleById(@PathVariable int roleId) {
        ResponseData responseData = new ResponseData();
        responseData.setData(roleService.getRoleById(roleId));
        return ResponseEntity.ok(responseData);
    }
}

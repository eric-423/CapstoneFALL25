package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.payload.request.CartItemRequest;
import com.capstone.tamtech.capstone.services.impl.CartItemService;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart-items")
public class CartItemController {


    @Autowired
    private CartItemService cartItemService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAllCartItems(@PathVariable int userId) {
        return new ResponseEntity<>(cartItemService.getAllCartItems(userId), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCartItemById(int id) {
        return new ResponseEntity<>(cartItemService.getCartItemById(id), HttpStatus.OK);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createCartItem(@PathVariable int userId, @RequestBody List<CartItemRequest> cartItemRequest) {
        return new ResponseEntity<>(cartItemService.createCartItem(userId, cartItemRequest), HttpStatus.CREATED);
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<?> updateCartItem(@PathVariable int userId, @RequestBody List<CartItemRequest> cartItemRequests) {
        return new ResponseEntity<>(cartItemService.updateCartItem(userId, cartItemRequests), HttpStatus.OK);
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> createCartItemForUser(@PathVariable int userId) {
        Boolean isCleared = cartItemService.clearCartItem(userId);
        return new ResponseEntity<>(isCleared, HttpStatus.OK);
    }

}

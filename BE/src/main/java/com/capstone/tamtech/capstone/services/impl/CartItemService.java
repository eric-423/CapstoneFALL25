package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.CartItemDTO;
import com.capstone.tamtech.capstone.payload.request.CartItemRequest;

import java.util.List;

public interface CartItemService {

    List<CartItemDTO> createCartItem(int userId, List<CartItemRequest> cartItemRequests);

    List<CartItemDTO> updateCartItem(int userId, List<CartItemRequest> cartItemRequests);

    List<CartItemDTO> getAllCartItems(int userId);

    CartItemDTO getCartItemById(int id);

    Boolean clearCartItem(int userId);

}

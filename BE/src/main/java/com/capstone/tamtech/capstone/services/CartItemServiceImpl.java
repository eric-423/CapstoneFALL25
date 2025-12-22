package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.CartItemDTO;
import com.capstone.tamtech.capstone.entities.CartItem;
import com.capstone.tamtech.capstone.entities.Combo;
import com.capstone.tamtech.capstone.entities.Product;
import com.capstone.tamtech.capstone.entities.Users;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.CartItemRequest;
import com.capstone.tamtech.capstone.repositories.CartItemRepository;
import com.capstone.tamtech.capstone.repositories.ComboRepository;
import com.capstone.tamtech.capstone.repositories.ProductRepository;
import com.capstone.tamtech.capstone.repositories.UsersRepository;
import com.capstone.tamtech.capstone.services.impl.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartItemServiceImpl implements CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ComboRepository comboRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private InventoryServiceImpl inventoryServiceImpl;

    private CartItemDTO mapToDTO(CartItem cartItem) {
        CartItemDTO cartItemDTO = new CartItemDTO();
        cartItemDTO.setId(cartItem.getCartId());

        if (cartItem.getProduct() != null) {
            cartItemDTO.setProductId(cartItem.getProduct().getId());
            cartItemDTO.setProductName((cartItemDTO.getProductName()));
        }
        if(cartItem.getCombo() != null) {
            cartItemDTO.setComboId(cartItem.getCombo().getId());
            cartItemDTO.setComboName(cartItemDTO.getComboName());
        }

        cartItemDTO.setQuantity(cartItem.getQuantity());
        cartItemDTO.setNote(cartItem.getNote());


        return cartItemDTO;
    }

    private CartItemDTO createOneCartItem(int userId, CartItemRequest cartItemRequest) {
        Product product = null;
        Combo combo = null;
        if(cartItemRequest.getProductId() != null && cartItemRequest.getComboId() == null) {
            product = productRepository.findById(cartItemRequest.getProductId()).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        } else if(cartItemRequest.getComboId() != null && cartItemRequest.getProductId() == null) {
            combo = comboRepository.findById(cartItemRequest.getComboId()).orElseThrow(() -> new ResourceNotFoundException("Combo not found"));
        } else {
            throw new IllegalArgumentException("Either productId or comboId must be provided, but not both.");
        }

        Users users = usersRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        CartItem cartItem = new CartItem();
        cartItem.setProduct(product);
        cartItem.setCombo(combo);
        cartItem.setUser(users);
        cartItem.setQuantity(cartItemRequest.getQuantity());
        cartItem.setNote(cartItemRequest.getNote());
        cartItemRepository.save(cartItem);

        return mapToDTO(cartItem);
    }


    @Override
    public List<CartItemDTO> createCartItem(int userId, List<CartItemRequest> cartItemRequests) {
        List<CartItemDTO> createdCartItems = new ArrayList<>();
        for(CartItemRequest cartItemRequest : cartItemRequests) {
            CartItemDTO createdCartItem = createOneCartItem(userId, cartItemRequest);
            createdCartItems.add(createdCartItem);
        }

        return createdCartItems;
    }

    @Override
    public List<CartItemDTO> updateCartItem(int userId, List<CartItemRequest> cartItemRequests) {
        List<CartItem> cartItems = cartItemRepository.findByUser_Id(userId);
        cartItemRepository.deleteAll(cartItems);

        return createCartItem(userId, cartItemRequests);
    }

    @Override
    public List<CartItemDTO> getAllCartItems(int userId) {

        List<CartItem> cartItems = cartItemRepository.findByUser_Id(userId);

        return cartItems.stream().map(this::mapToDTO).toList();
    }

    @Override
    public CartItemDTO getCartItemById(int id) {
        CartItem cartItem = cartItemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        return mapToDTO(cartItem);
    }

    @Override
    public Boolean clearCartItem(int userId) {
        try {
            List<CartItem> cartItems = cartItemRepository.findByUser_Id(userId);
            cartItemRepository.deleteAll(cartItems);
            return true;
        }catch (Exception e) {
            return false;
        }
    }

    @Override
    public Boolean checkCartItemAvailability(List<CartItemRequest> cartItemRequests, Integer branchId) {

        boolean allAvailable = true;

        for(CartItemRequest cartItemRequest:cartItemRequests){
            boolean isProduct = false;
            boolean isCombo = false;

            if(cartItemRequest.getProductId()!=null){
                isProduct = true;
            }

            if(cartItemRequest.getComboId()!=null){
                isCombo = true;
            }

            if(isProduct){
                int quantityRequest = cartItemRequest.getQuantity();
                int availableQuantity = inventoryServiceImpl.getAvailableProductQuantity(cartItemRequest.getProductId(), branchId);
                if(availableQuantity < quantityRequest){
                    allAvailable = false;
                    break;
                }
            }

            if(isCombo){
                int quantityRequest = cartItemRequest.getQuantity();
                int availableQuantity = inventoryServiceImpl.getAvailableComboQuantity(cartItemRequest.getComboId(), branchId);
                if(availableQuantity < quantityRequest){
                    allAvailable = false;
                    break;
                }
            }

        }

        return allAvailable;
    }
}

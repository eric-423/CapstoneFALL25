package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.*;
import com.capstone.tamtech.capstone.entities.*;
import com.capstone.tamtech.capstone.entities.keys.KeyOrderItem;
import com.capstone.tamtech.capstone.payload.request.OrderItemRequest;
import com.capstone.tamtech.capstone.payload.request.OrderRequest;
import com.capstone.tamtech.capstone.repositories.OrderRepository;
import com.capstone.tamtech.capstone.repositories.UsersRepository;
import com.capstone.tamtech.capstone.repositories.ProductRepository;
import com.capstone.tamtech.capstone.repositories.ComboRepository;
import com.capstone.tamtech.capstone.repositories.OrderItemRepository;
import com.capstone.tamtech.capstone.repositories.PromotionRepository;
import com.capstone.tamtech.capstone.services.impl.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Date;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DistanceService distanceService;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ComboRepository comboRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    @Override
    public OrderDTO createOrderForShipping(OrderRequest orderRequest){
        Order order = new Order();

        order.setAddress(orderRequest.getShippingAddress());
        order.setPhone(orderRequest.getShippingPhoneNumber());
        order.setPromotionCode(orderRequest.getPromotionCode());
        order.setDiscountValue(orderRequest.getDiscountValue());
        order.setPickUp(false);
        order.setCreatedAt(new Date());

        if (orderRequest.getCustomerId() > 0) {
            usersRepository.findById(orderRequest.getCustomerId()).ifPresent(order::setCustomer);
        }

        double subTotal = 0.0;
        if (orderRequest.getOrderItemList() != null) {
            for (OrderItemRequest itemReq : orderRequest.getOrderItemList()) {
                boolean isCombo = itemReq.getComboId() > 0;
                boolean isProduct = itemReq.getProductId() > 0;

                if (isCombo) {
                    Optional<Combo> comboOptional = comboRepository.findById(itemReq.getComboId());
                    if (comboOptional.isPresent()) {
                        Combo combo = comboOptional.get();
                        Double unitPrice = combo.getPrice() != null ? combo.getPrice() : 0.0;
                        int quantity = itemReq.getQuantity();
                        subTotal += unitPrice * quantity;
                    }
                }

                if (isProduct) {
                    Optional<Product> productOptional = productRepository.findById(itemReq.getProductId());
                    if (productOptional.isPresent()) {
                        Product product = productOptional.get();
                        double unitPrice = product.getPrice();
                        int quantity = itemReq.getQuantity();
                        subTotal += unitPrice * quantity;
                    }
                }
            }
        }
        order.setSubTotal(subTotal);

        String branchAddress = order.getBranch() != null ? order.getBranch().getAddress() : null;
        double shippingFee = calculateShippingFee(orderRequest.getShippingAddress(), branchAddress);
        order.setShippingFee(shippingFee);

        Integer discountPercent = 0;
        double discountValue = order.getDiscountValue() != 0 ? order.getDiscountValue() : 0.0;

        String promotionCode = orderRequest.getPromotionCode();
        boolean hasPromotionCode = promotionCode != null && !promotionCode.isBlank();
        if (hasPromotionCode) {
            Optional<Promotion> promotionOptional = promotionRepository.findByNameIgnoreCase(promotionCode.trim());
            if (promotionOptional.isPresent()) {
                Promotion promotion = promotionOptional.get();
                boolean promotionIsActive = promotion.isStatus();
                boolean meetsMinimum = subTotal >= (promotion.getMinimumOrderValue());

                if (promotionIsActive && meetsMinimum) {
                    String promotionTypeName = promotion.getPromotionType() != null ? promotion.getPromotionType().getName() : null;

                    boolean isPercentType = promotionTypeName != null && promotionTypeName.equalsIgnoreCase("Giảm giá theo %");
                    boolean isFixedType = promotionTypeName != null && promotionTypeName.equalsIgnoreCase("Giảm giá cố định");
                    boolean isFreeShipType = promotionTypeName != null && promotionTypeName.equalsIgnoreCase("Miễn phí vận chuyển");

                    if (isPercentType) {
                        int percent = Math.max(0, promotion.getValue());
                        discountPercent = percent;
                    }

                    if (isFixedType) {
                        double value = Math.max(0, promotion.getValue());
                        discountValue += value;
                    }

                    if (isFreeShipType) {
                        order.setShippingFee(0.0);
                    }
                }
            }
        }
        order.setDiscountPercent(discountPercent);
        order.setDiscountValue(discountValue);

        double percentDiscountAmount = 0.0;
        if (discountPercent != null && discountPercent > 0) {
            percentDiscountAmount = subTotal * ((double) discountPercent / 100.0);
        }
        double amount = subTotal - discountValue - percentDiscountAmount + order.getShippingFee();
        if (amount < 0) {
            amount = 0;
        }
        order.setAmount(amount);

        Order saved = orderRepository.save(order);

        if (orderRequest.getOrderItemList() != null) {
            for (var itemReq : orderRequest.getOrderItemList()) {
                boolean isProduct = itemReq.getProductId() > 0;
                boolean isCombo = itemReq.getComboId() > 0;

                if (isProduct) {
                    OrderItem orderItem = new OrderItem();
                    KeyOrderItem key = new KeyOrderItem();
                    key.setOrderId(saved.getId());
                    key.setProductId(itemReq.getProductId());
                    orderItem.setKeyOrderItem(key);
                    orderItem.setOrder(saved);

                    productRepository.findById(itemReq.getProductId()).ifPresent(orderItem::setProduct);

                    orderItem.setQuantity(itemReq.getQuantity());
                    double unitPrice = orderItem.getProduct() != null ? orderItem.getProduct().getPrice() : 0.0;
                    orderItem.setPrice(unitPrice);
                    orderItem.setNote(itemReq.getNote());

                    orderItemRepository.save(orderItem);
                }

                if (isCombo) {
                    // Chưa lưu item combo do cấu trúc khóa kép (order_id, product_id)
                    // Nếu cần lưu combo như một order item riêng, hãy xác nhận schema mong muốn
                }
            }
        }
        return toDTO(saved);
    }

    private double calculateShippingFee(String customerAddress, String branchAddress) {
        long meters = distanceService.getDistanceInMeters(branchAddress, customerAddress);
        if (meters >= 0 && meters <= 3000) {
            return 0.0;
        }
        return 0.0;
    }


    public OrderDTO toDTO(Order order){
        OrderDTO orderDTO = new OrderDTO();

        orderDTO.setId(order.getId());
        orderDTO.setSubTotal(order.getSubTotal());

        if(order.getPromotionCode() != null){
            orderDTO.setPromotionCode(order.getPromotionCode());
        }

        if(order.getDiscountValue()!=0){
            orderDTO.setDiscountValue(order.getDiscountValue());
        }

        if(order.getDiscountPercent()!=0){
            orderDTO.setDiscountPercent(order.getDiscountPercent());
        }

        orderDTO.setAmount(order.getAmount());
        if(order.getShipper()!=null){
            orderDTO.setShippingFee(order.getShippingFee());
            if(order.getDeliveryAtt()!=null){
                orderDTO.setDelivery_at(order.getDeliveryAtt());
            }
        } else if(order.isPickUp()){
            orderDTO.setIsPickUp(true);
            orderDTO.setIsTable(false);
            orderDTO.setPickupTime(order.getPickupTime());
        } else{
            orderDTO.setIsPickUp(false);
            orderDTO.setIsTable(true);
        }

        orderDTO.setOrderStatus(order.getStatus().getName());
        orderDTO.setNote(order.getNote());
        orderDTO.setPayment_code(order.getPaymentCode());
        orderDTO.setAddress(order.getAddress() != null ? order.getAddress() : "");
        orderDTO.setPhone(order.getPhone() != null ? order.getPhone() : "");
        orderDTO.setPointUsed(order.getPointUsed() != 0 ? order.getPointUsed() : 0);
        orderDTO.setPointEarned(order.getPointEarned() != 0 ? order.getPointUsed() : 0);
        orderDTO.setCreatedAt(order.getCreatedAt());

        List<OrderItem> orderItems = order.getOrderItems();
        List<OrderIemDTO> orderItemsDTO = new ArrayList<>();

        for(OrderItem orderItem : orderItems){
            OrderIemDTO orderIemDTO = toOrderItemDTO(orderItem);
            orderItemsDTO.add(orderIemDTO);
        }

        orderDTO.setOrderItems(orderItemsDTO);


        CustomerDTO customerDTO = new CustomerDTO();

        Users customer = order.getCustomer();

        customerDTO.setId(customer.getId());
        customerDTO.setFullName(customer.getFullName());

        orderDTO.setCustomerDTO(customerDTO);
        orderDTO.setCustomerName(customer.getFullName());
        orderDTO.setStatus(order.getStatus().getName());

        return orderDTO;
    }


    public OrderIemDTO toOrderItemDTO(OrderItem orderItem){
        OrderIemDTO orderIemDTO = new OrderIemDTO();

        if(orderItem.getCombo()!=null) {

            ComboDTO comboDTO = new ComboDTO();
            Combo combo = orderItem.getCombo();
            comboDTO.setId(combo.getId());
            comboDTO.setName(combo.getName());
            comboDTO.setDescription(combo.getDescription());
            comboDTO.setPrice(combo.getPrice());
            comboDTO.setStartDate(combo.getStartDate());
            comboDTO.setEndDate(combo.getEndDate());
            comboDTO.setBranchId(combo.getId());

            List<ComboItemDTO> comboItemDTOList = getComboItemDTOS(combo);
            comboDTO.setComboItems(comboItemDTOList);
            orderIemDTO.setComboDTO(comboDTO);
            orderIemDTO.setQuantity(orderItem.getQuantity());
        } else{
            Product product = orderItem.getProduct();

            orderIemDTO.setProductId(product.getId());
            orderIemDTO.setProductName(product.getName());
            orderIemDTO.setOrderId(orderItem.getOrder().getId());
            orderIemDTO.setQuantity(orderItem.getQuantity());
            orderIemDTO.setPrice(orderItem.getPrice());
            orderIemDTO.setNote(orderItem.getNote());
            orderIemDTO.setProductImg(product.getImage());
        }

        return orderIemDTO;
    }

    private static List<ComboItemDTO> getComboItemDTOS(Combo combo) {
        List<ComboItemDTO> comboItemDTOList = new ArrayList<ComboItemDTO>();
        List<ComboItem> comboItems = combo.getComboItems();

        for (ComboItem comboItem : comboItems) {
            ComboItemDTO comboItemDTO = new ComboItemDTO();
            comboItemDTO.setProductId(comboItem.getProduct().getId());
            comboItemDTO.setComboId(comboItem.getCombo().getId());
            comboItemDTO.setQuantity(comboItem.getQuantity());
            comboItemDTO.setNote(comboItem.getNote());
            comboItemDTOList.add(comboItemDTO);
        }
        return comboItemDTOList;
    }
}

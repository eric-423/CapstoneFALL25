package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.*;
import com.capstone.tamtech.capstone.entities.*;
import com.capstone.tamtech.capstone.entities.keys.KeyOrderItem;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.OrderItemRequest;
import com.capstone.tamtech.capstone.payload.request.OrderRequest;
import com.capstone.tamtech.capstone.payload.request.WaiterConfirmOrderRequest;
import com.capstone.tamtech.capstone.repositories.*;
import com.capstone.tamtech.capstone.services.impl.OrderService;
import com.capstone.tamtech.capstone.services.impl.PaymentService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Date;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DiningTableRepository diningTableRepository;

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

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private RoleHistoryRepository roleHistoryRepository;

    @Autowired
    private com.capstone.tamtech.capstone.services.impl.InventoryService inventoryService;

    @Override
    public OrderDTO createOrderForShipping(OrderRequest orderRequest) throws BadRequestException {
        inventoryService.assertSufficientMaterialsForOrder(orderRequest.getOrderItemList());
        Order order = new Order();

        order.setStatus(orderStatusRepository.findByName("CREATED").get());

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
            for (OrderItemRequest itemReq : orderRequest.getOrderItemList()) {
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
                    Optional<Combo> comboOptional = comboRepository.findById(itemReq.getComboId());
                    if (comboOptional.isPresent()) {
                        OrderItem orderItem = new OrderItem();
                        KeyOrderItem key = new KeyOrderItem();
                        key.setOrderId(saved.getId());
                        key.setProductId(0);
                        orderItem.setKeyOrderItem(key);
                        orderItem.setOrder(saved);
                        orderItem.setCombo(comboOptional.get());
                        orderItem.setQuantity(itemReq.getQuantity());
                        double unitPrice = orderItem.getCombo() != null && orderItem.getCombo().getPrice() != null ? orderItem.getCombo().getPrice() : 0.0;
                        orderItem.setPrice(unitPrice);
                        orderItem.setNote(itemReq.getNote());
                        orderItemRepository.save(orderItem);
                    }
                }
            }
        }
        Integer branchId = saved.getBranch() != null ? saved.getBranch().getId() : null;
        inventoryService.consumeMaterialsForOrderItems(saved.getOrderItems(), branchId);
        saved.setPaymentUrl(paymentService.createPaymentLink(saved.getId()));
        orderRepository.save(saved);
        OrderDTO result = toDTO(saved);
        result.setPaymentUrl(saved.getPaymentUrl());
        return result;
    }

    @Override
    public OrderDTO createOrderForDining(OrderRequest orderRequest) {
        inventoryService.assertSufficientMaterialsForOrder(orderRequest.getOrderItemList());
        Order order = new Order();

        order.setStatus(orderStatusRepository.findByName("CREATED").get());
        DiningTable diningTable = diningTableRepository.findById(orderRequest.getDiningTableId()).orElse(null);
        order.setDiningTable(diningTable);
        if (diningTable != null && diningTable.getBranch() != null) {
            order.setBranch(diningTable.getBranch());
        }

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
        order.setAmount(subTotal);

        Order saved = orderRepository.save(order);

        if (orderRequest.getOrderItemList() != null) {
            for (OrderItemRequest itemReq : orderRequest.getOrderItemList()) {
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
                    orderItem.setIsConfirmed(false);
                    orderItemRepository.save(orderItem);
                }

                if (isCombo) {
                    Optional<Combo> comboOptional = comboRepository.findById(itemReq.getComboId());
                    if (comboOptional.isPresent()) {
                        OrderItem orderItem = new OrderItem();
                        KeyOrderItem key = new KeyOrderItem();
                        key.setOrderId(saved.getId());
                        key.setProductId(0);
                        orderItem.setKeyOrderItem(key);
                        orderItem.setOrder(saved);
                        orderItem.setCombo(comboOptional.get());
                        orderItem.setQuantity(itemReq.getQuantity());
                        double unitPrice = orderItem.getCombo() != null && orderItem.getCombo().getPrice() != null ? orderItem.getCombo().getPrice() : 0.0;
                        orderItem.setPrice(unitPrice);
                        orderItem.setNote(itemReq.getNote());
                        orderItem.setIsConfirmed(false);
                        orderItemRepository.save(orderItem);
                    }
                }
            }
        }
        Integer branchId = saved.getBranch() != null ? saved.getBranch().getId() : null;
        inventoryService.consumeMaterialsForOrderItems(saved.getOrderItems(), branchId);
        orderRepository.save(saved);
        return toDTO(saved);
    }

    @Override
     public Boolean confirmOrderItem(WaiterConfirmOrderRequest waiterConfirmOrderRequest){
         Order order = orderRepository.findById(waiterConfirmOrderRequest.getOrderId()).orElseThrow(()->new ResourceNotFoundException("Order not found"));
         List<OrderItem> orderItems = order.getOrderItems();
 
         Integer branchId = order.getBranch() != null ? order.getBranch().getId() : null;
 
        double confirmedSubTotal = 0.0;
        if (orderItems != null) {
            for (OrderItem oi : orderItems) {
                if (oi.getIsConfirmed() == null || !oi.getIsConfirmed()) {
                    inventoryService.restoreMaterialsForOrderItems(List.of(oi), branchId);
                    orderItemRepository.delete(oi);
                } else {
                    if (oi.getProduct() != null) {
                        confirmedSubTotal += oi.getPrice() * oi.getQuantity();
                    }
                    if (oi.getCombo() != null && oi.getCombo().getPrice() != null) {
                        confirmedSubTotal += oi.getPrice() * oi.getQuantity();
                    }
                }
            }
        }

        double subTotal = 0.0;
        Date now = new Date();
        if (waiterConfirmOrderRequest.getOrderItems() != null) {
            for (OrderItem incoming : waiterConfirmOrderRequest.getOrderItems()) {
                boolean hasCombo = incoming.getCombo() != null && incoming.getCombo().getId() > 0;
                boolean hasProduct = incoming.getProduct() != null && incoming.getProduct().getId() > 0;

                if (hasProduct) {
                    OrderItem newItem = new OrderItem();
                    KeyOrderItem key = new KeyOrderItem();
                    key.setOrderId(order.getId());
                    key.setProductId(incoming.getProduct().getId());
                    newItem.setKeyOrderItem(key);
                    newItem.setOrder(order);
                    productRepository.findById(incoming.getProduct().getId()).ifPresent(newItem::setProduct);
                    int qty = Math.max(0, incoming.getQuantity());
                    newItem.setQuantity(qty);
                    double unitPrice = newItem.getProduct() != null ? newItem.getProduct().getPrice() : 0.0;
                    newItem.setPrice(unitPrice);
                    newItem.setNote(incoming.getNote());
                    newItem.setIsConfirmed(true);
                    newItem.setConfirmAt(now);
                    orderItemRepository.save(newItem);
                    order.getOrderItems().add(newItem);
                    subTotal += unitPrice * qty;
                }

                if (hasCombo) {
                    OrderItem newItem = new OrderItem();
                    KeyOrderItem key = new KeyOrderItem();
                    key.setOrderId(order.getId());
                    key.setProductId(0);
                    newItem.setKeyOrderItem(key);
                    newItem.setOrder(order);
                    comboRepository.findById(incoming.getCombo().getId()).ifPresent(newItem::setCombo);
                    int qty = Math.max(0, incoming.getQuantity());
                    newItem.setQuantity(qty);
                    Double unitPrice = newItem.getCombo() != null ? newItem.getCombo().getPrice() : 0.0;
                    newItem.setPrice(unitPrice != null ? unitPrice : 0.0);
                    newItem.setNote(incoming.getNote());
                    newItem.setIsConfirmed(true);
                    newItem.setConfirmAt(now);
                    orderItemRepository.save(newItem);
                    order.getOrderItems().add(newItem);
                    subTotal += (unitPrice != null ? unitPrice : 0.0) * qty;
                }
            }
        }

        double newSubTotal = confirmedSubTotal + subTotal;
        order.setSubTotal(newSubTotal);

        inventoryService.consumeMaterialsForOrderItems(order.getOrderItems(), branchId);
        orderRepository.save(order);
        return true;
    }

    @Override
    public Boolean confirmDeliveredOrderItem(WaiterConfirmOrderRequest waiterConfirmOrderRequest){
        Order order = orderRepository.findById(waiterConfirmOrderRequest.getOrderId()).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        List<OrderItem> orderItems = order.getOrderItems();
        Date now = new Date();
        
        if (waiterConfirmOrderRequest.getOrderItems() != null) {
            for (OrderItem incoming : waiterConfirmOrderRequest.getOrderItems()) {
                for (OrderItem existing : orderItems) {
                    boolean match = false;
                    if (existing.getProduct() != null && incoming.getProduct() != null && 
                        existing.getProduct().getId() == incoming.getProduct().getId()) {
                        match = true;
                    }
                    if (existing.getCombo() != null && incoming.getCombo() != null && 
                        existing.getCombo().getId() == incoming.getCombo().getId()) {
                        match = true;
                    }
                    if (match) {
                        existing.setIsDelivered(true);
                        orderItemRepository.save(existing);
                    }
                }
            }
        }
        return true;
    }

    @Override
    @Transactional
    public void cancelOrder(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        Integer branchId = order.getBranch() != null ? order.getBranch().getId() : null;
        inventoryService.restoreMaterialsForOrderItems(order.getOrderItems(), branchId);
        order.setStatus(orderStatusRepository.findByName("CANCEL").orElseThrow(() -> new RuntimeException("OrderStatus CANCEL not found")));
        order.setPaymentUrl(null);
        order.setPaymentCode(null);
        orderRepository.save(order);
    }

    @Override
    public void markOrderPaidSuccess(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(orderStatusRepository.findByName("IN PROCESS").orElseThrow(() -> new RuntimeException("OrderStatus IN_PROCESS not found")));
        orderRepository.save(order);
    }

    @Override
    public boolean assignOrderToCheff(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        Branch branch = order.getBranch();
        if (branch == null) {
            throw new RuntimeException("Order has no branch assigned");
        }
        int branchId = branch.getId();

        List<RoleHistory> chefs = roleHistoryRepository.findByRole_NameAndBranch_IdAndIsActiveTrue("CHEFF", branchId);
        if (chefs == null || chefs.isEmpty()) {
            throw new RuntimeException("No chefs found for branch id=" + branchId);
        }
        Users selected = null;
        for (RoleHistory rh : chefs) {
            Users user = rh.getUser();
            if (!user.getIsBusy()) {
                selected = user;
                break;
            }
        }
        if (selected == null) {
            selected = chefs.get(0).getUser();
        }
        order.setWorker(selected);
        order.setStatus(orderStatusRepository.findByName("COOKING").orElseThrow(() -> new RuntimeException("OrderStatus COOKING not found")));
        orderRepository.save(order);
        return true;
    }

    @Override
    public boolean markAsCooked(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        Users chef = usersRepository.findById(order.getWorker().getId()).orElseThrow(() -> new RuntimeException("Chef not found"));

        chef.setIsBusy(false);
        usersRepository.save(chef);
        order.setStatus(orderStatusRepository.findByName("COOKED").orElseThrow(() -> new RuntimeException("OrderStatus COOKING not found")));

        orderRepository.save(order);

        return true;

    }

    @Override
    public boolean assignToShipper(int orderId) {

        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        Branch branch = order.getBranch();
        if (branch == null) {
            throw new RuntimeException("Order has no branch assigned");
        }
        int branchId = branch.getId();

        List<RoleHistory> shipper = roleHistoryRepository.findByRole_NameAndBranch_IdAndIsActiveTrue("SHIPPER", branchId);
        if (shipper == null || shipper.isEmpty()) {
            throw new RuntimeException("No shipper found for branch id=" + branchId);
        }
        Users selected = null;
        for (RoleHistory rh : shipper) {
            Users user = rh.getUser();
            if (!user.getIsBusy()) {
                selected = user;
                break;
            }
        }
        if (selected == null) {
            selected = shipper.get(0).getUser();
        }
        order.setShipper(selected);
        selected.setIsBusy(true);
        usersRepository.save(selected);
        order.setStatus(orderStatusRepository.findByName("SHIPPING").orElseThrow(() -> new RuntimeException("OrderStatus COOKING not found")));
        orderRepository.save(order);

        return true;
    }

    @Override
    public boolean deliveredOrder(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        Users shipper = order.getShipper();
        shipper.setIsBusy(false);

        usersRepository.save(shipper);
        orderRepository.save(order);

        return true;
    }

    @Override
    public boolean completeOrder(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        Users shipper = order.getShipper();
        Users customer = order.getCustomer();

        customer.setMemberPoint(customer.getMemberPoint()+(int)(order.getAmount()/1000));
        shipper.setIsBusy(false);
        usersRepository.save(shipper);
        usersRepository.save(customer);
        order.setStatus(orderStatusRepository.findByName("COMPLETED").orElseThrow(() -> new RuntimeException("OrderStatus COMPLETED not found")));
        orderRepository.save(order);

        return true;
    }

    @Override
    public double calculateShippingFee(String customerAddress, String branchAddress) throws BadRequestException {
        double shippingFee = 0.0;
        long meters = distanceService.getDistanceInMeters(branchAddress, customerAddress);

        if(meters>5000){
            throw new BadRequestException("We only ship in 5km");
        }
        if (meters >= 0 && meters <= 3000) {
            return 0.0;
        } else{
            shippingFee = (meters-3000)*10000;
        }
        return shippingFee;
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

        orderIemDTO.setIsConfirmed(orderItem.getIsConfirmed());
        orderIemDTO.setIsDelivered(orderItem.getIsDelivered());

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

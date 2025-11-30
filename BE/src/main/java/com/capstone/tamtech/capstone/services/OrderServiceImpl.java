package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.*;
import com.capstone.tamtech.capstone.entities.*;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.DiningTableProductRequest;
import com.capstone.tamtech.capstone.payload.request.OrderItemRequest;
import com.capstone.tamtech.capstone.payload.request.OrderRequest;
import com.capstone.tamtech.capstone.payload.request.WaiterConfirmOrderRequest;
import com.capstone.tamtech.capstone.repositories.*;
import com.capstone.tamtech.capstone.services.impl.OrderService;
import com.capstone.tamtech.capstone.services.impl.PaymentService;
import com.capstone.tamtech.capstone.services.impl.PromotionService;
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
    private PaymentService paymentService;

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private RoleHistoryRepository roleHistoryRepository;

    @Autowired
    private com.capstone.tamtech.capstone.services.impl.InventoryService inventoryService;

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @Autowired
    private PromotionService promotionService;

    @Autowired
    private OrderBillService orderBillService;

    @Autowired
    private com.capstone.tamtech.capstone.services.impl.MemberAssociationService memberAssociationService;

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
        order.setBranch(branchRepository.findById(orderRequest.getBranchId()).orElse(null));

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
        if (hasPromotionCode && orderRequest.getCustomerId() > 0) {
            PromotionValidationResult validationResult = promotionService
                    .validateAndApplyPromotion(
                            orderRequest.getCustomerId(),
                            promotionCode,
                            subTotal);

            if (validationResult.isValid()) {
                discountPercent = validationResult.getDiscountPercent();
                discountValue += validationResult.getDiscountValue();

                if (validationResult.isFreeShipping()) {
                    order.setShippingFee(0.0);
                }

                order.setPromotion(validationResult.getPromotion());
            } else {
                throw new BadRequestException(validationResult.getErrorMessage());
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
                        orderItem.setOrder(saved);
                        orderItem.setCombo(comboOptional.get());
                        orderItem.setQuantity(itemReq.getQuantity());
                        double unitPrice = orderItem.getCombo() != null && orderItem.getCombo().getPrice() != null
                                ? orderItem.getCombo().getPrice()
                                : 0.0;
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
        saved.setPaymentMethod(paymentMethodRepository.findById(orderRequest.getPaymentMethodId()).orElse(null));
        orderRepository.save(saved);
        OrderDTO result = toDTO(saved);
        result.setPaymentUrl(saved.getPaymentUrl());
        return result;
    }

    @Override
    public OrderDTO createOrderForPickup(OrderRequest orderRequest) throws BadRequestException {
        inventoryService.assertSufficientMaterialsForOrder(orderRequest.getOrderItemList());
        Order order = new Order();

        order.setStatus(orderStatusRepository.findByName("CREATED").get());

        if (orderRequest.getBranchId() > 0) {
            branchRepository.findById(orderRequest.getBranchId()).ifPresent(order::setBranch);
        }

        order.setPhone(orderRequest.getShippingPhoneNumber());
        order.setPromotionCode(orderRequest.getPromotionCode());
        order.setDiscountValue(orderRequest.getDiscountValue());
        order.setPickUp(true);
        order.setShippingFee(0.0);
        order.setPaymentMethod(paymentMethodRepository.findById(orderRequest.getPaymentMethodId()).orElse(null));
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

        Integer discountPercent = 0;
        double discountValue = order.getDiscountValue() != 0 ? order.getDiscountValue() : 0.0;

        String promotionCode = orderRequest.getPromotionCode();
        boolean hasPromotionCode = promotionCode != null && !promotionCode.isBlank();
        if (hasPromotionCode && orderRequest.getCustomerId() > 0) {
            com.capstone.tamtech.capstone.dto.PromotionValidationResult validationResult = promotionService
                    .validateAndApplyPromotion(
                            orderRequest.getCustomerId(),
                            promotionCode,
                            subTotal);

            if (validationResult.isValid()) {
                discountPercent = validationResult.getDiscountPercent();
                discountValue += validationResult.getDiscountValue();

                order.setPromotion(validationResult.getPromotion());
            } else {
                throw new BadRequestException(validationResult.getErrorMessage());
            }
        }
        order.setDiscountPercent(discountPercent);
        order.setDiscountValue(discountValue);

        double percentDiscountAmount = 0.0;
        if (discountPercent != null && discountPercent > 0) {
            percentDiscountAmount = subTotal * ((double) discountPercent / 100.0);
        }
        double amount = subTotal - discountValue - percentDiscountAmount;
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
                        orderItem.setOrder(saved);
                        orderItem.setCombo(comboOptional.get());
                        orderItem.setQuantity(itemReq.getQuantity());
                        double unitPrice = orderItem.getCombo() != null && orderItem.getCombo().getPrice() != null
                                ? orderItem.getCombo().getPrice()
                                : 0.0;
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
        order.setIsTable(true);
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
        order.setPaymentMethod(paymentMethodRepository.findById(orderRequest.getPaymentMethodId()).orElse(null));

        Order saved = orderRepository.save(order);

        if (orderRequest.getOrderItemList() != null) {
            for (OrderItemRequest itemReq : orderRequest.getOrderItemList()) {
                boolean isProduct = itemReq.getProductId() > 0;
                boolean isCombo = itemReq.getComboId() > 0;

                if (isProduct) {
                    OrderItem orderItem = new OrderItem();
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
                        orderItem.setOrder(saved);
                        orderItem.setCombo(comboOptional.get());
                        orderItem.setQuantity(itemReq.getQuantity());
                        double unitPrice = orderItem.getCombo() != null && orderItem.getCombo().getPrice() != null
                                ? orderItem.getCombo().getPrice()
                                : 0.0;
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
    @Transactional
    public Boolean confirmOrderItem(WaiterConfirmOrderRequest waiterConfirmOrderRequest) {
        Order order = orderRepository.findById(waiterConfirmOrderRequest.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        List<OrderItem> orderItems = order.getOrderItems();

        Integer branchId = order.getBranch() != null ? order.getBranch().getId() : null;

        double confirmedSubTotal = 0.0;
        List<OrderItem> itemsToDelete = new ArrayList<>();
        List<OrderItem> confirmedItems = new ArrayList<>();

        if (orderItems != null) {
            for (OrderItem oi : orderItems) {
                if (oi.getIsConfirmed() == null || !oi.getIsConfirmed()) {
                    itemsToDelete.add(oi);
                } else if (oi.getIsDelivered() != null) {
                    continue;
                } else {
                    confirmedItems.add(oi);
                    if (oi.getProduct() != null) {
                        confirmedSubTotal += oi.getPrice() * oi.getQuantity();
                    }
                    if (oi.getCombo() != null && oi.getCombo().getPrice() != null) {
                        confirmedSubTotal += oi.getPrice() * oi.getQuantity();
                    }
                }
            }
        }

        if (!itemsToDelete.isEmpty()) {
            inventoryService.restoreMaterialsForOrderItems(itemsToDelete, branchId);
            for (OrderItem oi : itemsToDelete) {
                order.getOrderItems().remove(oi);
                orderItemRepository.delete(oi);
            }
        }

        double subTotal = 0.0;
        Date now = new Date();

        if (waiterConfirmOrderRequest.getOrderItems() != null) {

            for (OrderItemRequest incoming : waiterConfirmOrderRequest.getOrderItems()) {
                boolean hasCombo = incoming.getComboId() != 0;
                boolean hasProduct = incoming.getProductId() != 0;

                if (hasProduct) {
                    OrderItem newItem = new OrderItem();
                    newItem.setOrder(order);
                    productRepository.findById(incoming.getProductId()).ifPresent(newItem::setProduct);
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
                    newItem.setOrder(order);
                    comboRepository.findById(incoming.getComboId()).ifPresent(newItem::setCombo);
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
        order.setStatus(orderStatusRepository.findByName("COOKING")
                .orElseThrow(() -> new RuntimeException("OrderStatus CONFIRMED not found")));
        inventoryService.consumeMaterialsForOrderItems(order.getOrderItems(), branchId);
        orderRepository.save(order);
        return true;
    }

    @Override
    @Transactional
    public Boolean confirmDeliveredOrderItem(WaiterConfirmOrderRequest waiterConfirmOrderRequest) {
        Order order = orderRepository.findById(waiterConfirmOrderRequest.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        List<OrderItem> orderItems = order.getOrderItems();

        if (waiterConfirmOrderRequest.getOrderItems() != null && orderItems != null) {
            for (OrderItemRequest incoming : waiterConfirmOrderRequest.getOrderItems()) {
                boolean hasProduct = incoming.getProductId() != 0;
                boolean hasCombo = incoming.getComboId() != 0;

                for (OrderItem existing : orderItems) {
                    if (existing.getIsConfirmed() == null || !existing.getIsConfirmed()) {
                        continue;
                    }
                    if (existing.getIsDelivered() != null && existing.getIsDelivered()) {
                        continue;
                    }

                    boolean match = false;

                    if (hasProduct && existing.getProduct() != null &&
                            existing.getProduct().getId() == incoming.getProductId()) {
                        match = true;
                    }

                    if (hasCombo && existing.getCombo() != null &&
                            existing.getCombo().getId() == incoming.getComboId()) {
                        match = true;
                    }

                    if (match) {
                        existing.setIsDelivered(true);
                        existing.setDeliveredAt(new Date());
                        orderItemRepository.save(existing);
                        break;
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

        if (order.getPromotion() != null && order.getCustomer() != null && order.getPaymentTime() != null) {
            promotionService.rollbackPromotionUsage(
                    order.getCustomer().getId(),
                    order.getPromotion().getId());
        }

        order.setStatus(orderStatusRepository.findByName("CANCEL")
                .orElseThrow(() -> new RuntimeException("OrderStatus CANCEL not found")));
        order.setPaymentUrl(null);
        order.setPaymentCode(null);
        orderRepository.save(order);
    }

    @Override
    public void markOrderPaidSuccess(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setPaymentTime(new Date());

        if (order.getPromotion() != null && order.getCustomer() != null) {
            promotionService.markPromotionAsUsed(
                    order.getCustomer().getId(),
                    order.getPromotion().getId());
        }

        boolean isDiningTable = order.getIsTable() != null && order.getIsTable();
        boolean isPickup = order.isPickUp();
        if (isDiningTable) {
            OrderStatus completedStatus = orderStatusRepository.findByName("PAID")
                    .orElseThrow(() -> new RuntimeException("PAID COMPLETED not found"));
            order.setStatus(completedStatus);

            if (order.getCustomer() != null) {
                Users customer = order.getCustomer();
                int pointsEarned = (int) (order.getAmount() / 1000);
                customer.setMemberPoint(customer.getMemberPoint() + pointsEarned);
                order.setPointEarned(pointsEarned);
                usersRepository.save(customer);
                memberAssociationService.updateMemberAssiociationForCustomer(customer.getId());
            }

            if (order.getDiningTable() != null) {
                DiningTable table = order.getDiningTable();
                table.setIsActive(true);
                diningTableRepository.save(table);
            }
        } else if (isPickup) {
            order.setStatus(orderStatusRepository.findByName("IN_PROCESS")
                    .orElseThrow(() -> new RuntimeException("OrderStatus IN_PROCESS not found")));
        } else {
            order.setStatus(orderStatusRepository.findByName("IN_PROCESS")
                    .orElseThrow(() -> new RuntimeException("OrderStatus IN_PROCESS not found")));
        }

        order.setPaymentCode("PAY-" + orderId + "-" + System.currentTimeMillis());
        orderRepository.save(order);

        try {
            orderBillService.generateAndUploadBill(orderId);
        } catch (Exception e) {
            System.err.println("Failed to generate bill for order " + orderId + ": " + e.getMessage());
        }
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
        order.setStatus(orderStatusRepository.findByName("COOKING")
                .orElseThrow(() -> new RuntimeException("OrderStatus COOKING not found")));
        orderRepository.save(order);
        return true;
    }

    @Override
    public boolean markAsCooked(int orderId, List<Long> cookedOrderItemIds) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        Users chef = usersRepository.findById(order.getWorker().getId())
                .orElseThrow(() -> new RuntimeException("Chef not found"));

        chef.setIsBusy(false);
        usersRepository.save(chef);

        for(Long itemId : cookedOrderItemIds) {
            OrderItem item = orderItemRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("OrderItem not found with id=" + itemId));
            item.setIsCooked(true);
            item.setCookedAt(new Date());
            orderItemRepository.save(item);
        }

        if (checkAllItemsCooked(order)) {
            order.setStatus(orderStatusRepository.findByName("COOKED")
                    .orElseThrow(() -> new RuntimeException("OrderStatus COOKING not found")));
        }


        orderRepository.save(order);

        return true;

    }

    private boolean checkAllItemsCooked(Order order) {
        List<OrderItem> orderItems = order.getOrderItems();
        for (OrderItem item : orderItems) {
            if (item.getIsCooked() == null || !item.getIsCooked()) {
                return false;
            }
        }
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

        List<RoleHistory> shipper = roleHistoryRepository.findByRole_NameAndBranch_IdAndIsActiveTrue("SHIPPER",
                branchId);
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
        order.setStatus(orderStatusRepository.findByName("SHIPPING")
                .orElseThrow(() -> new RuntimeException("OrderStatus COOKING not found")));
        orderRepository.save(order);

        return true;
    }

    @Override
    public boolean deliveredOrder(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus().getName().equals("DELIVERED")) {
            throw new RuntimeException("Order has already been delivered");
        }
        OrderStatus orderStatus = orderStatusRepository.findByName("DELIVERED")
                .orElseThrow(() -> new RuntimeException("OrderStatus DELIVERED not found"));
        order.setStatus(orderStatus);
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

        customer.setMemberPoint(customer.getMemberPoint() + (int) (order.getAmount() / 1000));
        shipper.setIsBusy(false);
        usersRepository.save(shipper);
        usersRepository.save(customer);
        memberAssociationService.updateMemberAssiociationForCustomer(customer.getId());
        order.setStatus(orderStatusRepository.findByName("COMPLETED")
                .orElseThrow(() -> new RuntimeException("OrderStatus COMPLETED not found")));
        orderRepository.save(order);

        return true;
    }

    @Override
    public double calculateShippingFee(String customerAddress, String branchAddress) throws BadRequestException {
        double shippingFee = 0.0;
        long meters = distanceService.getDistanceInMeters(branchAddress, customerAddress);

        if (meters > 5000) {
            throw new BadRequestException("We only ship in 5km");
        }
        if (meters >= 0 && meters <= 3000) {
            return 0.0;
        } else {
            double kmOver = Math.ceil((meters - 3000) / 1000.0);
            shippingFee = kmOver * 10000;
        }
        return shippingFee;
    }

    public OrderDTO toDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();

        orderDTO.setId(order.getId());
        orderDTO.setSubTotal(order.getSubTotal());

        if (order.getPromotionCode() != null) {
            orderDTO.setPromotionCode(order.getPromotionCode());
        }

        if (order.getDiscountValue() != 0) {
            orderDTO.setDiscountValue(order.getDiscountValue());
        }

        if (order.getDiscountPercent() != 0) {
            orderDTO.setDiscountPercent(order.getDiscountPercent());
        }

        orderDTO.setAmount(order.getAmount());
        if (order.getShipper() != null) {
            orderDTO.setShippingFee(order.getShippingFee());
            if (order.getDeliveryAtt() != null) {
                orderDTO.setDelivery_at(order.getDeliveryAtt());
            }
        } else if (order.isPickUp()) {
            orderDTO.setIsPickUp(true);
            orderDTO.setIsTable(false);
            orderDTO.setPickupTime(order.getPickupTime());
        } else {
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

        for (OrderItem orderItem : orderItems) {
            OrderIemDTO orderIemDTO = toOrderItemDTO(orderItem);
            orderItemsDTO.add(orderIemDTO);
        }

        orderDTO.setOrderItems(orderItemsDTO);
        orderDTO.setBillPdfUrl(order.getBillPdfUrl());
        orderDTO.setPaymentUrl(order.getPaymentUrl());

        Users customer = order.getCustomer();
        if (customer != null) {
            CustomerDTO customerDTO = new CustomerDTO();
            customerDTO.setId(customer.getId());
            customerDTO.setFullName(customer.getFullName());
            orderDTO.setCustomerDTO(customerDTO);
            orderDTO.setCustomerName(customer.getFullName());
        }


        orderDTO.setStatus(order.getStatus().getName());

        return orderDTO;
    }

    public OrderIemDTO toOrderItemDTO(OrderItem orderItem) {
        OrderIemDTO orderIemDTO = new OrderIemDTO();
        orderIemDTO.setOrderItemId(orderItem.getId());

        if (orderItem.getCombo() != null) {

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
        } else {
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
        orderIemDTO.setConfirmAt(orderItem.getConfirmAt());
        orderIemDTO.setCookedAt(orderItem.getCookedAt());
        orderIemDTO.setIsDelivered(orderItem.getIsDelivered());
        orderIemDTO.setDeliveredAt(orderItem.getDeliveredAt());
        orderIemDTO.setIsCooked(orderItem.getIsCooked());

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

    @Override
    @Transactional
    public OrderDTO payDiningTableOrder(
            com.capstone.tamtech.capstone.payload.request.DiningTablePaymentRequest paymentRequest)
            throws BadRequestException {
        Order order = orderRepository.findById(paymentRequest.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getIsTable() == null || !order.getIsTable()) {
            throw new BadRequestException("This order is not a dining table order");
        }

        List<OrderItem> orderItems = order.getOrderItems();
        if (orderItems == null || orderItems.isEmpty()) {
            throw new BadRequestException("Order has no items");
        }

        for (OrderItem item : orderItems) {
            if (item.getIsDelivered() == null || !item.getIsDelivered()) {
                throw new BadRequestException("All order items must be delivered before payment");
            }
        }

        double subTotal = 0.0;
        for (OrderItem item : orderItems) {
            if (item.getProduct() != null) {
                subTotal += item.getPrice() * item.getQuantity();
            }
            if (item.getCombo() != null && item.getCombo().getPrice() != null) {
                subTotal += item.getPrice() * item.getQuantity();
            }
        }
        order.setSubTotal(subTotal);

        order.setPromotionCode(paymentRequest.getPromotionCode());
        double discountValue = paymentRequest.getDiscountValue() != 0 ? paymentRequest.getDiscountValue() : 0.0;
        order.setDiscountValue(discountValue);

        Integer discountPercent = 0;
        String promotionCode = paymentRequest.getPromotionCode();
        boolean hasPromotionCode = promotionCode != null && !promotionCode.isBlank();

        if (hasPromotionCode && order.getCustomer() != null) {
            com.capstone.tamtech.capstone.dto.PromotionValidationResult validationResult = promotionService
                    .validateAndApplyPromotion(
                            order.getCustomer().getId(),
                            promotionCode,
                            subTotal);

            if (validationResult.isValid()) {
                discountPercent = validationResult.getDiscountPercent();
                discountValue += validationResult.getDiscountValue();

                order.setPromotion(validationResult.getPromotion());
            } else {
                throw new BadRequestException(validationResult.getErrorMessage());
            }
        }
        order.setDiscountPercent(discountPercent);
        order.setDiscountValue(discountValue);

        double percentDiscountAmount = 0.0;
        if (discountPercent != null && discountPercent > 0) {
            percentDiscountAmount = subTotal * ((double) discountPercent / 100.0);
        }
        double amount = subTotal - discountValue - percentDiscountAmount;
        if (amount < 0) {
            amount = 0;
        }
        order.setAmount(amount);

        PaymentMethod paymentMethod = paymentMethodRepository.findById(paymentRequest.getPaymentMethodId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found"));
        order.setPaymentMethod(paymentMethod);

        boolean isPayOS = paymentMethod.getName() != null && paymentMethod.getName().equalsIgnoreCase("PAYOS");

        if (isPayOS) {
            orderRepository.save(order);
            String paymentUrl = paymentService.createPaymentLink(order.getId());
            order.setPaymentUrl(paymentUrl);
            OrderStatus pendingPaymentStatus = orderStatusRepository.findByName("IN_PROCESS")
                    .orElse(orderStatusRepository.findByName("CREATED").orElse(null));
            if (pendingPaymentStatus != null) {
                order.setStatus(pendingPaymentStatus);
            }
            orderRepository.save(order);
            OrderDTO result = toDTO(order);
            result.setPaymentUrl(paymentUrl);
            return result;
        } else {
            order.setPaymentTime(new Date());
            OrderStatus completedStatus = orderStatusRepository.findByName("COMPLETED")
                    .orElseThrow(() -> new ResourceNotFoundException("OrderStatus COMPLETED not found"));
            order.setStatus(completedStatus);

            if (order.getPromotion() != null && order.getCustomer() != null) {
                promotionService.markPromotionAsUsed(
                        order.getCustomer().getId(),
                        order.getPromotion().getId());
            }
            order.setPaymentCode("PAY-" + order.getId() + "-" + System.currentTimeMillis());

            if (order.getCustomer() != null) {
                Users customer = order.getCustomer();
                int pointsEarned = (int) (order.getAmount() / 1000);
                customer.setMemberPoint(customer.getMemberPoint() + pointsEarned);
                order.setPointEarned(pointsEarned);
                usersRepository.save(customer);
                memberAssociationService.updateMemberAssiociationForCustomer(customer.getId());
            }

            if (order.getDiningTable() != null) {
                DiningTable table = order.getDiningTable();
                table.setIsActive(true);
                diningTableRepository.save(table);
            }

            orderRepository.save(order);
            return toDTO(order);
        }
    }

    @Override
    public boolean customerPickedUpOrder(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getPickupTime() != null) {
            throw new RuntimeException("Order already picked up");
        }

        boolean isPickup = order.isPickUp();
        if (!isPickup) {
            throw new RuntimeException("This order is not a pickup order");
        }

        order.setPickupTime(new Date());
        OrderStatus completedStatus = orderStatusRepository.findByName("COMPLETED")
                .orElseThrow(() -> new RuntimeException("OrderStatus COMPLETED not found"));
        order.setStatus(completedStatus);

        if (order.getPromotion() != null && order.getCustomer() != null) {
            promotionService.markPromotionAsUsed(
                    order.getCustomer().getId(),
                    order.getPromotion().getId());
        }

        if (order.getCustomer() != null) {
            Users customer = order.getCustomer();
            int pointsEarned = (int) (order.getAmount() / 1000);
            customer.setMemberPoint(customer.getMemberPoint() + pointsEarned);
            order.setPointEarned(pointsEarned);
            usersRepository.save(customer);
            memberAssociationService.updateMemberAssiociationForCustomer(customer.getId());
        }

        orderRepository.save(order);
        return true;
    }

    @Override
    public OrderDTO updateOrderForDining(int orderId, DiningTableProductRequest diningTableProductRequest) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (diningTableProductRequest.getOrderItems() != null) {
            for (OrderItemRequest itemReq : diningTableProductRequest.getOrderItems()) {
                boolean isProduct = itemReq.getProductId() > 0;
                boolean isCombo = itemReq.getComboId() > 0;

                if (isProduct) {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);

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
                        orderItem.setOrder(order);
                        orderItem.setCombo(comboOptional.get());
                        orderItem.setQuantity(itemReq.getQuantity());
                        double unitPrice = orderItem.getCombo() != null && orderItem.getCombo().getPrice() != null
                                ? orderItem.getCombo().getPrice()
                                : 0.0;
                        orderItem.setPrice(unitPrice);
                        orderItem.setNote(itemReq.getNote());

                        orderItem.setIsConfirmed(false);

                        orderItemRepository.save(orderItem);
                    }
                }
            }
        }

        return toDTO(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderListDTO> getCustomerOrders(int customerId, String status) {
        List<Order> orders;

        if (status != null && !status.isEmpty() && !status.equalsIgnoreCase("ALL")) {
            orders = orderRepository.findByCustomer_IdAndStatus_NameOrderByCreatedAtDesc(customerId, status);
        } else {
            orders = orderRepository.findByCustomerId(customerId);
        }

        return convertToOrderListDTO(orders);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderListDTO> getBranchOrders(int branchId, String status) {
        List<Order> orders;

        if (status != null && !status.isEmpty() && !status.equalsIgnoreCase("ALL")) {
            orders = orderRepository.findByBranch_IdAndStatus_NameOrderByCreatedAtDesc(branchId, status);
        } else {
            orders = orderRepository.findByBranchId(branchId);
        }
        return convertToOrderListDTO(orders);
    }

    @Override
    public OrderDTO getOrderById(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        return toDTO(order);
    }

    @Override
    public List<OrderCheffViewDTO> getOrdersByChefId(int chefId, String status) {
        List<Order> orders = orderRepository.findByWorker_IdAndStatus_NameOrderByCreatedAtDesc(chefId, status);
        return orders.stream().map(this::convertToOrderCheffViewDTO).toList();
    }

    private OrderCheffViewDTO convertToOrderCheffViewDTO(Order order) {
        OrderCheffViewDTO dto = new OrderCheffViewDTO();
        dto.setOrderId(order.getId());

        List<OrderIemDTO> orderItemDTOs = new ArrayList<>();
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                OrderIemDTO itemDTO = toOrderItemDTO(item);
                orderItemDTOs.add(itemDTO);
            }
        }
        dto.setOrderItems(orderItemDTOs);
        return dto;
    }

    private List<OrderListDTO> convertToOrderListDTO(List<Order> orders) {
        return orders.stream().map(order -> {
            OrderListDTO dto = new OrderListDTO();
            dto.setId(order.getId());

            dto.setOrderStatus(order.getStatus() != null && order.getStatus().getName() != null
                    ? order.getStatus().getName()
                    : null);

            dto.setOrderDate(order.getCreatedAt());
            dto.setPaymentTime(order.getPaymentTime());
            dto.setDeliveryAt(order.getDeliveryAtt());
            if (order.getPaymentMethod() != null) {
                dto.setPaymentMethod(order.getPaymentMethod().getName());
            }

            if (order.getCustomer() != null) {
                dto.setCustomerName(order.getCustomer().getFullName());
                dto.setCustomerPhone(order.getCustomer().getPhoneNumber());
            }

            dto.setAddress(order.getAddress());

            if (order.getBranch() != null) {
                dto.setBranchName(order.getBranch().getName());
                dto.setBranchAddress(order.getBranch().getAddress());
            }

            dto.setSubTotal(order.getSubTotal());
            dto.setShippingFee(order.getShippingFee() != null ? order.getShippingFee() : 0.0);
            dto.setDiscountValue(order.getDiscountValue());
            dto.setAmount(order.getAmount());

            dto.setPromotionCode(order.getPromotionCode());
            dto.setPointUsed(order.getPointUsed());
            dto.setPointEarned(order.getPointEarned());

            dto.setPickUp(order.isPickUp());
            dto.setTable(order.getIsTable() != null ? order.getIsTable() : false);

            if (order.getShipper() != null) {
                dto.setShipperName(order.getShipper().getFullName());
            }
            if (order.getWaiter() != null) {
                dto.setWaiterName(order.getWaiter().getFullName());
            }
            if (order.getWorker() != null) {
                dto.setChefName(order.getWorker().getFullName());
            }

            try {
                dto.setItemCount(order.getOrderItems() != null ? order.getOrderItems().size() : 0);
            } catch (Exception e) {
                dto.setItemCount(0);
            }

            return dto;
        }).collect(java.util.stream.Collectors.toList());
    }
}

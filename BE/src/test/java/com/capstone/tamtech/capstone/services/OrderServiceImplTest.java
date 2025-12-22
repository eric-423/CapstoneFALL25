package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.OrderDTO;
import com.capstone.tamtech.capstone.entities.*;
import com.capstone.tamtech.capstone.payload.request.OrderItemRequest;
import com.capstone.tamtech.capstone.payload.request.OrderRequest;
import com.capstone.tamtech.capstone.payload.request.WaiterConfirmOrderRequest;
import com.capstone.tamtech.capstone.repositories.*;
import com.capstone.tamtech.capstone.services.impl.InventoryService;
import com.capstone.tamtech.capstone.services.impl.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UsersRepository usersRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ComboRepository comboRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private PromotionRepository promotionRepository;

    @Mock
    private OrderStatusRepository orderStatusRepository;

    @Mock
    private BranchRepository branchRepository;

    @Mock
    private RoleHistoryRepository roleHistoryRepository;

    @Mock
    private DistanceService distanceService;

    @Mock
    private InventoryService inventoryService;

    @Mock
    private PaymentService paymentService;

    @Mock
    private DiningTableRepository diningTableRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private Order mockOrder;
    private OrderRequest mockOrderRequest;
    private OrderStatus mockOrderStatus;
    private Branch mockBranch;
    private Users mockUser;
    private Product mockProduct;

    @BeforeEach
    void setUp() {
        // Setup mock entities
        mockOrderStatus = new OrderStatus();
        mockOrderStatus.setId(1);
        mockOrderStatus.setName("CREATED");

        mockBranch = new Branch();
        mockBranch.setId(1);
        mockBranch.setName("Test Branch");
        mockBranch.setAddress("123 Test St");

        mockUser = new Users();
        mockUser.setId(23);
        mockUser.setFullName("Test Customer");

        mockProduct = new Product();
        mockProduct.setId(1);
        mockProduct.setName("Test Product");
        mockProduct.setPrice(50000.0);

        mockOrder = new Order();
        mockOrder.setId(1);
        mockOrder.setStatus(mockOrderStatus);
        mockOrder.setCustomer(mockUser);
        mockOrder.setBranch(mockBranch);
        mockOrder.setAmount(100000.0);
        mockOrder.setSubTotal(100000.0);

        mockOrderRequest = new OrderRequest();
        mockOrderRequest.setCustomerId(23);
        mockOrderRequest.setMode("SHIPPING");
        mockOrderRequest.setShippingAddress("123 Customer St");
        mockOrderRequest.setShippingPhoneNumber("0912345678");

        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(1);
        itemRequest.setComboId(0);
        itemRequest.setQuantity(2);
        itemRequest.setPrice(0);
        mockOrderRequest.setOrderItemList(List.of(itemRequest));
    }

    @Test
    void testCreateOrderForShipping_Success() throws Exception {
        // Arrange
        when(orderRepository.save(any(Order.class))).thenReturn(mockOrder);
        when(orderStatusRepository.findByName("CREATED")).thenReturn(Optional.of(mockOrderStatus));
        when(usersRepository.findById(23)).thenReturn(Optional.of(mockUser));
        when(productRepository.findById(1)).thenReturn(Optional.of(mockProduct));
        when(distanceService.getDistanceInMeters(anyString(), anyString())).thenReturn(2000L);
        doNothing().when(inventoryService).assertSufficientMaterialsForOrder(any(), any());
        doNothing().when(inventoryService).consumeMaterialsForOrderItems(any(), any());

        // Act
        OrderDTO result = orderService.createOrderForShipping(mockOrderRequest);

        // Assert
        assertNotNull(result);
        verify(orderRepository, atLeastOnce()).save(any(Order.class));
        verify(inventoryService).assertSufficientMaterialsForOrder(any(), any());
    }

    @Test
    void testCancelOrder_Success() {
        // Arrange
        when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));
        when(orderStatusRepository.findByName("CANCEL")).thenReturn(Optional.of(mockOrderStatus));
        doNothing().when(inventoryService).restoreMaterialsForOrderItems(any(), any());

        // Act
        orderService.cancelOrder(1);

        // Assert
        verify(orderRepository).save(any(Order.class));
        verify(inventoryService).restoreMaterialsForOrderItems(any(), any());
    }

    @Test
    void testMarkOrderPaidSuccess_Success() {
        // Arrange
        OrderStatus inProcessStatus = new OrderStatus();
        inProcessStatus.setId(2);
        inProcessStatus.setName("IN_PROCESS");

        when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));
        when(orderStatusRepository.findByName("IN_PROCESS")).thenReturn(Optional.of(inProcessStatus));

        // Act
        orderService.markOrderPaidSuccess(1);

        // Assert
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void testAssignOrderToCheff_Success() {
        // Arrange
        when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));

        Users chef = new Users();
        chef.setId(100);
        chef.setIsBusy(false);

        RoleHistory roleHistory = new RoleHistory();
        roleHistory.setUser(chef);

        when(roleHistoryRepository.findByRole_NameAndBranch_IdAndIsActiveTrue("CHEFF", 1))
                .thenReturn(List.of(roleHistory));

        OrderStatus cookingStatus = new OrderStatus();
        cookingStatus.setId(3);
        cookingStatus.setName("COOKING");
        when(orderStatusRepository.findByName("COOKING")).thenReturn(Optional.of(cookingStatus));

        // Act
        boolean result = orderService.assignOrderToCheff(1);

        // Assert
        assertTrue(result);
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void testConfirmOrderItem_Success() {
        // Arrange
        WaiterConfirmOrderRequest request = new WaiterConfirmOrderRequest();
        request.setOrderId(1);
        request.setWaiterId(1);

        OrderItem confirmedItem = new OrderItem();
        confirmedItem.setIsConfirmed(true);
        confirmedItem.setPrice(50000.0);
        confirmedItem.setQuantity(1);
        confirmedItem.setProduct(mockProduct);

        when(orderRepository.findById(1)).thenReturn(Optional.of(mockOrder));
        when(mockOrder.getOrderItems()).thenReturn(List.of(confirmedItem));
        when(mockOrder.getBranch()).thenReturn(mockBranch);
        doNothing().when(inventoryService).consumeMaterialsForOrderItems(any(), any());

        // Act
        Boolean result = orderService.confirmOrderItem(request);

        // Assert
        assertTrue(result);
        verify(orderRepository).save(any(Order.class));
    }
}

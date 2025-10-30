package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.entities.Combo;
import com.capstone.tamtech.capstone.entities.Order;
import com.capstone.tamtech.capstone.entities.OrderItem;
import com.capstone.tamtech.capstone.repositories.OrderRepository;
import com.capstone.tamtech.capstone.services.impl.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.v2.paymentRequests.PaymentLinkItem;

import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private OrderRepository orderRepository;

    public final String returnUrl = "";

    public final String cancelUrl = "";

    public PayOS payOS;

    @Value("${PAYOS_CLIENT_ID}")
    private String clientId;

    @Value("${PAYOS_API_KEY}")
    private String apiKey;

    @Value("${PAYOS_CHECKSUM_KEY}")
    private String checksumKey;



    @Override
    public String createPaymentLink(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        payOS = new PayOS(clientId, apiKey, checksumKey);

        try {
            final String description = "Payment for order " + orderId;
            final long price = (long) order.getAmount();
            long orderCode = orderId;

            List<PaymentLinkItem> paymentLinkItemList = new ArrayList<>();

            for(OrderItem orderItem : order.getOrderItems()){
                PaymentLinkItem paymentLinkItem = new PaymentLinkItem();

                if(orderItem.getCombo()!=null){
                    Combo combo = orderItem.getCombo();
                    paymentLinkItem.setName(combo.getName());
                    paymentLinkItem.setPrice(combo.getPrice().longValue());
                } else{
                    paymentLinkItem.setName(orderItem.getProduct().getName());
                    paymentLinkItem.setPrice(orderItem.getProduct().getPrice().longValue());
                }
                paymentLinkItem.setQuantity(orderItem.getQuantity());
                paymentLinkItemList.add(paymentLinkItem);
            }

            CreatePaymentLinkRequest paymentData =
                CreatePaymentLinkRequest.builder()
                    .orderCode(orderCode)
                    .description(description)
                    .amount(price)
                    .items(paymentLinkItemList)
                    .returnUrl(returnUrl)
                    .cancelUrl(cancelUrl)
                    .build();

            CreatePaymentLinkResponse data = payOS.paymentRequests().create(paymentData);
            try {
                String url = data.getCheckoutUrl();
                if (url != null && !url.isEmpty()) {
                    return url;
                }
            } catch(Exception ignore) {}
            return data.getPaymentLinkId();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

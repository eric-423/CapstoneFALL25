package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "[order]")
@Data
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private int id;

    @Column(name = "order_sub_total")
    private double subTotal;

    @Column(name = "order_promotion_code")
    private String promotionCode;

    @Column(name = "order_discount_value")
    private double discountValue = 0;

    @Column(name = "order_discount_percent")
    private int discountPercent;

    @Column(name = "order_amount")
    private double amount;

    @Column(name = "order_shiping_free")
    private double shippingFee;

    @Column(name = "order_delivery_at")
    private Date deliveryAtt;

    @Column(name = "order_note")
    private String note;

    @Column(name = "order_payment_code")
    private String paymentCode;

    @Column(name = "order_address")
    private String address;

    @Column(name = "invoice_url")
    private String invoiceUrl;

    @Column(name = "order_phone")
    private String phone;

    @Column(name = "order_point_used")
    private int pointUsed;

    @Column(name = "order_point_earned")
    private int pointEarned;

    @Column(name = "order_created_at")
    private Date createdAt;

    @Column(name = "is_pick_up")
    private boolean isPickUp;

    @Column(name = "payment_time")
    private Date paymentTime;

    @Column(name = "payment_url", columnDefinition = "TEXT")
    private String paymentUrl;

    @Column(name = "expired_payment_time")
    private Date expiredPaymentTime;

    @Column(name = "pickup_time")
    private Date pickupTime;

    @Column(name = "is_table")
    private Boolean isTable;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_email")
    private String customerEmail;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH })
    @JoinColumn(name = "customer_id")
    private Users customer;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH })
    @JoinColumn(name = "worker_id")
    private Users worker;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH })
    @JoinColumn(name = "shipped_by")
    private Users shipper;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH })
    @JoinColumn(name = "waiter_id")
    private Users waiter;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH })
    @JoinColumn(name = "status_id")
    private OrderStatus status;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH })
    @JoinColumn(name = "payment_method_id")
    private PaymentMethod paymentMethod;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH })
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.REFRESH, CascadeType.DETACH })
    private List<OrderItem> orderItems = new java.util.ArrayList<>();

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH })
    @JoinColumn(name = "dining_table_id")
    private DiningTable diningTable;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH })
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

}
